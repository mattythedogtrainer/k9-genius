import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { db, collections } from '@k9-genius/db';
import { Timestamp } from 'firebase-admin/firestore';

// ============ TYPES & SCHEMAS ============

const enrollmentWebhookSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  productSlug: z.string().min(1, 'Product slug is required'),
  source: z.enum(['shopify', 'samcart', 'stripe', 'zapier', 'make', 'api']),
  sourceRef: z.string().optional(),
  idempotencyKey: z.string().min(1, 'Idempotency key is required'),
});

type EnrollmentWebhookPayload = z.infer<typeof enrollmentWebhookSchema>;

// ============ MIDDLEWARE ============

/**
 * Validates API key from Authorization header
 * Expected format: Authorization: Bearer <api_key>
 */
async function validateApiKey(req: NextRequest): Promise<{ valid: boolean; error?: string }> {
  const authHeader = req.headers.get('authorization');

  if (!authHeader) {
    return { valid: false, error: 'Missing Authorization header' };
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { valid: false, error: 'Invalid Authorization header format' };
  }

  const apiKey = parts[1];
  if (!apiKey || apiKey.length < 8) {
    return { valid: false, error: 'Invalid API key format' };
  }

  const prefix = apiKey.substring(0, 8);

  try {
    // Find API key by prefix
    const snapshot = await db
      .collection('lmsApiKeys')
      .where('prefix', '==', prefix)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { valid: false, error: 'API key not found' };
    }

    const storedKey = snapshot.docs[0].data();
    const keyDocRef = snapshot.docs[0].ref;

    if (!storedKey.isActive) {
      return { valid: false, error: 'API key is inactive' };
    }

    if (storedKey.expiresAt && storedKey.expiresAt.toDate() < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    // Verify key hash (SHA-256)
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    if (keyHash !== storedKey.keyHash) {
      return { valid: false, error: 'API key verification failed' };
    }

    // Update last used timestamp
    await keyDocRef.update({
      lastUsedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return { valid: true };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, error: 'API key validation failed' };
  }
}

// ============ MAIN HANDLER ============

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    const keyValidation = await validateApiKey(req);
    if (!keyValidation.valid) {
      return NextResponse.json(
        { status: 'error', message: keyValidation.error },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let payload: EnrollmentWebhookPayload;
    try {
      const body = await req.json();
      payload = enrollmentWebhookSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Invalid request body',
            details: error.errors,
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Normalize email
    const email = payload.email.toLowerCase().trim();

    // ============ IDEMPOTENCY CHECK ============
    const existingEventSnapshot = await db
      .collection('lmsWebhookEvents')
      .where('idempotencyKey', '==', payload.idempotencyKey)
      .limit(1)
      .get();

    if (!existingEventSnapshot.empty) {
      const existingEvent = existingEventSnapshot.docs[0].data();
      if (existingEvent.status === 'COMPLETED') {
        return NextResponse.json(
          { status: 'duplicate', message: 'Webhook already processed' },
          { status: 200 }
        );
      }
      if (existingEvent.status === 'FAILED') {
        return NextResponse.json(
          { status: 'error', message: 'Previous attempt failed', errorMessage: existingEvent.errorMessage },
          { status: 400 }
        );
      }
    }

    // ============ CREATE PENDING WEBHOOK EVENT ============
    const webhookEventRef = await db.collection('lmsWebhookEvents').add({
      idempotencyKey: payload.idempotencyKey,
      source: payload.source,
      eventType: 'enrollment',
      payload: payload as any,
      status: 'PENDING',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    const webhookEventId = webhookEventRef.id;

    try {
      // ============ FIND OR CREATE USER ============
      let user: any;
      let userId: string;

      const userSnapshot = await collections.users
        .where('email', '==', email)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        // Generate placeholder clerkId for pending users
        const pendingClerkId = `pending_${crypto.randomBytes(8).toString('hex')}`;

        const userRef = await collections.users.add({
          email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          clerkId: pendingClerkId,
          role: 'CONSUMER',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        userId = userRef.id;
        user = { id: userId, email, firstName: payload.firstName, lastName: payload.lastName };
      } else {
        userId = userSnapshot.docs[0].id;
        user = { id: userId, ...userSnapshot.docs[0].data() };
      }

      // ============ FIND PRODUCT ============
      const productSnapshot = await collections.lmsProducts
        .where('slug', '==', payload.productSlug)
        .limit(1)
        .get();

      if (productSnapshot.empty) {
        throw new Error(`Product not found: ${payload.productSlug}`);
      }

      const product = { id: productSnapshot.docs[0].id, ...productSnapshot.docs[0].data() };
      const productId = productSnapshot.docs[0].id;

      // ============ GRANT ENTITLEMENT ============
      // Normalize source to enum value (capitalize)
      const sourceEnumMap: Record<string, any> = {
        shopify: 'SHOPIFY',
        samcart: 'SAMCART',
        stripe: 'STRIPE',
        zapier: 'ZAPIER',
        make: 'MAKE',
        api: 'API',
      };

      const source = sourceEnumMap[payload.source] || 'API';

      // Check if entitlement exists
      const entitlementSnapshot = await collections.lmsUserEntitlements
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .limit(1)
        .get();

      let entitlementId: string;

      if (entitlementSnapshot.empty) {
        const entitlementRef = await collections.lmsUserEntitlements.add({
          userId,
          productId,
          source,
          sourceRef: payload.sourceRef,
          isActive: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        entitlementId = entitlementRef.id;
      } else {
        entitlementId = entitlementSnapshot.docs[0].id;
        await entitlementSnapshot.docs[0].ref.update({
          isActive: true,
          source,
          sourceRef: payload.sourceRef,
          updatedAt: Timestamp.now(),
        });
      }

      // ============ AUTO-ENROLL IN LINKED COURSES ============
      const productCourseAccessSnapshot = await collections.lmsProductCourseAccess
        .where('productId', '==', productId)
        .get();

      for (const accessDoc of productCourseAccessSnapshot.docs) {
        const access = accessDoc.data();
        const courseId = access.courseId;

        const enrollmentSnapshot = await collections.lmsEnrollments
          .where('userId', '==', userId)
          .where('courseId', '==', courseId)
          .limit(1)
          .get();

        if (enrollmentSnapshot.empty) {
          await collections.lmsEnrollments.add({
            userId,
            courseId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      }

      // ============ AUTO-ASSIGN LINKED ROADMAPS ============
      const productRoadmapAccessSnapshot = await collections.lmsProductRoadmapAccess
        .where('productId', '==', productId)
        .get();

      for (const accessDoc of productRoadmapAccessSnapshot.docs) {
        const access = accessDoc.data();
        const roadmapId = access.roadmapId;

        const roadmapProgressSnapshot = await collections.lmsUserRoadmapProgress
          .where('userId', '==', userId)
          .where('roadmapId', '==', roadmapId)
          .limit(1)
          .get();

        if (roadmapProgressSnapshot.empty) {
          await collections.lmsUserRoadmapProgress.add({
            userId,
            roadmapId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      }

      // ============ CREATE CERTIFICATION CANDIDACIES ============
      const productCertAccessSnapshot = await collections.lmsProductCertAccess
        .where('productId', '==', productId)
        .get();

      for (const accessDoc of productCertAccessSnapshot.docs) {
        const access = accessDoc.data();
        const certificationId = access.certificationId;

        const candidacySnapshot = await collections.lmsCertCandidacies
          .where('userId', '==', userId)
          .where('certificationId', '==', certificationId)
          .limit(1)
          .get();

        if (candidacySnapshot.empty) {
          await collections.lmsCertCandidacies.add({
            userId,
            certificationId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      }

      // ============ CREATE AUDIT LOG ============
      await db.collection('lmsAuditLogs').add({
        userId,
        action: 'ENROLLMENT_GRANTED',
        entityType: 'ENTITLEMENT',
        entityId: entitlementId,
        source: `webhook:${payload.source}`,
        metadata: {
          productId,
          sourceRef: payload.sourceRef,
          idempotencyKey: payload.idempotencyKey,
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // ============ MARK WEBHOOK EVENT AS COMPLETED ============
      await webhookEventRef.update({
        status: 'COMPLETED',
        processedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json(
        {
          status: 'success',
          userId,
          entitlementId,
          message: 'Enrollment processed successfully',
        },
        { status: 200 }
      );
    } catch (error) {
      // Mark webhook event as failed
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await webhookEventRef.update({
        status: 'FAILED',
        errorMessage,
        updatedAt: Timestamp.now(),
      });

      console.error('Webhook processing error:', error);

      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to process enrollment',
          errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Webhook handler error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// ============ OPTIONS HANDLER (for CORS preflight) ============

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
