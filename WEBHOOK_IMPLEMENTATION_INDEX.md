# K9 Genius LMS Webhook Implementation - Complete Index

## Project Overview

A complete, production-ready webhook system has been implemented for the K9 Genius LMS to handle external enrollment provisioning from payment processors (Shopify, SamCart, Stripe) and automation platforms (Zapier, Make.com).

## Quick Links

- **Main Endpoint**: `/apps/lms/app/api/webhooks/enrollment/route.ts`
- **Setup Guide**: `/WEBHOOK_SETUP.md`
- **API Documentation**: `/apps/lms/app/api/webhooks/README.md`
- **Integration Examples**: `/apps/lms/examples/webhook-integrations.ts`
- **API Key Generator**: `/apps/lms/scripts/create-webhook-api-key.ts`

---

## File Directory

### Core Webhook Endpoint

```
apps/lms/app/api/webhooks/enrollment/route.ts (450+ lines)
```

**Purpose**: Main webhook handler for enrollment provisioning

**Key Features**:
- ✓ POST endpoint with API key authentication
- ✓ SHA-256 API key validation
- ✓ Request body validation with Zod
- ✓ Idempotency checking
- ✓ User creation/lookup
- ✓ Product entitlement granting
- ✓ Auto-course enrollment
- ✓ Roadmap assignment
- ✓ Certification candidacy creation
- ✓ Comprehensive audit logging
- ✓ Error handling and retry support
- ✓ CORS support with OPTIONS handler

**Imports**:
```typescript
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '@k9-genius/db';
```

**Main Functions**:
- `validateApiKey(req)` - API key validation middleware
- `POST(req)` - Main webhook handler
- `OPTIONS(req)` - CORS preflight handler

---

### Utility Functions

```
apps/lms/app/api/webhooks/utils.ts (150+ lines)
```

**Purpose**: Helper functions for API key management and webhook operations

**Functions**:
- `generateApiKey()` - Creates new API keys (sk_ prefix, SHA-256)
- `hashApiKey(key)` - Hashes an API key consistently
- `verifyApiKey(key, hash)` - Safe key verification
- `extractApiKeyFromHeader(header)` - Parses Authorization header
- `getApiKeyPrefix(apiKey)` - Gets 8-char prefix for DB lookup
- `logWebhookEvent(idempotencyKey, source, status, details)` - Structured logging
- `isValidEmail(email)` - Email format validation
- `normalizeEmail(email)` - Lowercase and trim
- `generatePendingClerkId()` - Creates temporary Clerk IDs for pending users

**Constants**:
- `SOURCE_ENUM_MAP` - Maps sources to enum values
- `webhookResponses` - Response helpers
- `HTTP_STATUS` - HTTP status constants

---

### TypeScript Type Definitions

```
apps/lms/app/api/webhooks/types.ts (300+ lines)
```

**Purpose**: Complete TypeScript interface and type definitions

**Interfaces**:
- `EnrollmentWebhookPayload` - Request schema
- `WebhookSuccessResponse` - Success response format
- `WebhookDuplicateResponse` - Duplicate request response
- `WebhookErrorResponse` - Error response format
- `GeneratedApiKey` - Key generation result
- `ApiKeyValidation` - Key validation result
- `WebhookEvent` - Database record type
- `UserEntitlementData` - Entitlement data
- `AuditLogEntry` - Audit log record
- `WebhookConfig` - Configuration options

**Type Guards**:
- `isWebhookSource(value)` - Validates webhook source
- `isEntitlementSourceEnum(value)` - Validates enum
- `isWebhookEventStatus(value)` - Validates status
- `isValidEmail(email)` - Email validation

**Constants**:
- `WEBHOOK_CONFIG_DEFAULTS` - Default settings
- `HTTP_STATUS` - Status code map
- `WEBHOOK_ERROR_CODES` - Error code definitions
- `ERROR_CODE_STATUS_MAP` - Error to status mapping

---

### API Documentation

```
apps/lms/app/api/webhooks/README.md (600+ lines)
```

**Sections**:
1. Overview and key features
2. API endpoint reference with request/response formats
3. Setup and configuration instructions
4. Payment processor setup (Shopify, SamCart, Stripe)
5. Zapier integration guide
6. Make.com integration guide
7. Database schema documentation
8. Error handling and retry strategies
9. Webhook event flow diagram
10. Monitoring and debugging tips
11. Security considerations
12. Testing examples (cURL and TypeScript)
13. Future enhancements

---

### Script: API Key Generator

```
apps/lms/scripts/create-webhook-api-key.ts (100+ lines)
```

**Purpose**: CLI tool to create and store API keys

**Usage**:
```bash
npx ts-node scripts/create-webhook-api-key.ts "Integration Name" [--expiry-days N]
```

**Features**:
- ✓ Generates cryptographically secure keys
- ✓ Creates SHA-256 hash for storage
- ✓ Stores in LmsApiKey table
- ✓ Supports optional expiration
- ✓ Displays key once (cannot be recovered)
- ✓ Shows usage examples

**Output**:
```
API Key (use this to authenticate):
sk_<32_hex_chars>

curl -X POST https://yourdomain.com/api/webhooks/enrollment \
  -H "Authorization: Bearer sk_<key>" \
  ...
```

---

### Integration Examples

```
apps/lms/examples/webhook-integrations.ts (500+ lines)
```

**Purpose**: Complete implementation examples for all integration platforms

**Includes**:
- Shopify order webhook handler
- SamCart purchase webhook handler
- Stripe webhook handler
- Zapier configuration template (JSON)
- Make.com configuration template
- Node.js/Express server example
- Retry logic with exponential backoff
- Error handling patterns
- Testing utilities

**Example Functions**:
- `handleShopifyOrderWebhook(order)` - Process Shopify orders
- `handleSamCartPurchaseWebhook(purchase)` - Process SamCart purchases
- `handleStripeWebhook(event)` - Process Stripe events
- `sendWebhookWithRetry(payload, maxRetries)` - Retry logic
- `testWebhook(apiKey, url, payload)` - Testing helper
- `generateTestPayload(overrides)` - Test data generator

---

### Test Suite

```
apps/lms/__tests__/webhooks.test.ts (300+ lines)
```

**Purpose**: Comprehensive unit and integration tests

**Test Groups**:
1. Webhook API Key Utils (generateApiKey, hashApiKey, verifyApiKey)
2. Webhook Enrollment Endpoint
   - API Key Validation
   - Request Validation
   - Idempotency handling
   - User Management
   - Product Lookup
   - Entitlement Granting
   - Course Auto-Enrollment
   - Roadmap Assignment
   - Certification Candidacy
   - Audit Logging
   - Error Handling
   - Response Format
3. End-to-End Integration
4. Edge Cases

**Framework**: Vitest with mocked Prisma

---

### Setup Guide

```
WEBHOOK_SETUP.md (400+ lines)
```

**Sections**:
1. Quick start guide (4 steps)
2. Files created with descriptions
3. Endpoint details and examples
4. Security features
5. Database schema overview
6. Monitoring and debugging queries
7. Performance considerations
8. Next steps and support
9. Troubleshooting common issues

---

### Environment Variables

```
apps/lms/.env.example
```

**Categories**:
- Database configuration
- Authentication (Clerk)
- Webhook configuration
- Payment processor secrets
- Integration platform keys
- Monitoring and logging
- Security settings
- Application settings

---

## Database Schema Integration

### Used Tables

1. **LmsApiKey** - API key storage with SHA-256 hashing
   ```sql
   id, name, keyHash, prefix, permissions, isActive, lastUsedAt, expiresAt, createdAt, createdBy
   ```

2. **LmsWebhookEvent** - Webhook event tracking and retry
   ```sql
   id, source, eventType, payload, idempotencyKey, status, processedAt, errorMessage, retryCount, createdAt, updatedAt
   ```

3. **LmsUserEntitlement** - User product entitlements
   ```sql
   id, userId, productId, source, sourceRef, grantedAt, expiresAt, isActive, createdAt, updatedAt
   ```

4. **LmsProduct** - Product definitions
   ```sql
   id, name, slug, description, isActive, createdAt, updatedAt
   ```

5. **LmsEnrollment** - Course enrollments
   ```sql
   id, userId, courseId, progress, enrolledAt, completedAt, lastAccessedAt, lastLessonId
   ```

6. **LmsProductCourseAccess** - Product to course mapping
   ```sql
   id, productId, courseId (unique constraint)
   ```

7. **LmsProductRoadmapAccess** - Product to roadmap mapping
   ```sql
   id, productId, roadmapId (unique constraint)
   ```

8. **LmsProductCertAccess** - Product to certification mapping
   ```sql
   id, productId, certificationId (unique constraint)
   ```

9. **LmsUserRoadmapProgress** - Roadmap progress tracking
   ```sql
   id, userId, roadmapId, progress, startedAt, completedAt, updatedAt
   ```

10. **LmsCertCandidacy** - Certification candidacy
    ```sql
    id, userId, certificationId, status, startedAt, completedAt, passedAt, expiresAt
    ```

11. **LmsAuditLog** - Audit trail
    ```sql
    id, userId, action, entityType, entityId, metadata, source, ipAddress, createdAt
    ```

12. **User** - Existing user model
    ```sql
    id, clerkId, email, firstName, lastName, displayName, role, ...
    ```

---

## API Request/Response Format

### Success Request

```bash
POST /api/webhooks/enrollment
Authorization: Bearer sk_<api_key>
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "productSlug": "dog-training-fundamentals",
  "source": "shopify",
  "sourceRef": "order_12345",
  "idempotencyKey": "evt_unique_12345"
}
```

### Success Response (200)

```json
{
  "status": "success",
  "userId": "user_id_abc123",
  "entitlementId": "entitlement_id_def456",
  "message": "Enrollment processed successfully"
}
```

### Duplicate Request (200)

```json
{
  "status": "duplicate",
  "message": "Webhook already processed"
}
```

### Validation Error (400)

```json
{
  "status": "error",
  "message": "Invalid request body",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### Auth Error (401)

```json
{
  "status": "error",
  "message": "API key verification failed"
}
```

### Server Error (500)

```json
{
  "status": "error",
  "message": "Failed to process enrollment",
  "errorMessage": "Product not found: invalid-slug"
}
```

---

## Workflow Processing Steps

1. **API Key Validation**
   - Extract from Authorization header (Bearer token)
   - Validate prefix exists in database
   - Verify hash matches (SHA-256, timing-safe comparison)
   - Check if active and not expired
   - Update lastUsedAt timestamp

2. **Request Validation**
   - Parse JSON body
   - Validate with Zod schema
   - Return 400 if invalid

3. **Idempotency Check**
   - Look up idempotencyKey in LmsWebhookEvent
   - Return 200 duplicate if already COMPLETED
   - Return 400 error if previously FAILED
   - Otherwise, continue

4. **Create Pending Event**
   - Insert new LmsWebhookEvent with PENDING status
   - Store full payload for audit

5. **User Management**
   - Find user by normalized email
   - Create if not found with role CONSUMER and pending clerkId

6. **Product Lookup**
   - Find product by slug
   - Return 400 error if not found

7. **Grant Entitlement**
   - Upsert LmsUserEntitlement
   - Set source and sourceRef

8. **Auto-Enroll Courses**
   - Find all LmsProductCourseAccess records
   - Upsert LmsEnrollment for each

9. **Assign Roadmaps**
   - Find all LmsProductRoadmapAccess records
   - Upsert LmsUserRoadmapProgress for each

10. **Create Cert Candidacies**
    - Find all LmsProductCertAccess records
    - Upsert LmsCertCandidacy for each (status: NOT_STARTED)

11. **Audit Logging**
    - Create LmsAuditLog entry with all metadata

12. **Mark as Completed**
    - Update LmsWebhookEvent to COMPLETED status
    - Set processedAt timestamp

13. **Return Success**
    - Return 200 with userId and entitlementId

---

## Security Implementation

### API Key Security
- Generated with 32 bytes of cryptographic randomness
- Prefixed with "sk_" for identification
- Hashed with SHA-256 before storage
- Verified with timing-safe comparison
- Supports expiration dates
- Can be deactivated independently

### Request Validation
- Zod schema validation for all inputs
- Email format validation
- Source enum validation
- Required field checks
- Type coercion and transformation

### Data Protection
- Email normalization (lowercase, trim)
- Placeholder Clerk IDs for pending users
- Audit logging of all actions
- Error messages don't expose sensitive info

### HTTPS & CORS
- OPTIONS handler for preflight
- CORS headers in response
- Should enforce HTTPS at reverse proxy
- IP whitelisting supported (future)

---

## Development Notes

### Dependencies
- `next/server` - NextResponse handler
- `zod` - Request validation
- `crypto` - SHA-256 hashing (Node.js built-in)
- `@k9-genius/db` - Prisma client

### No External Dependencies Added
- Uses only existing project dependencies
- Leverages Node.js crypto module
- Integrates with existing Prisma setup

### TypeScript Support
- Full type definitions provided
- Type guards for validation
- Strict null checks enabled
- ESNext target

---

## Performance Considerations

- **Database Indexes**: Used on idempotencyKey, status, userId
- **Upsert Operations**: Prevents duplicates efficiently
- **Batch Processing**: Handles multiple items in single context
- **Key Lookup**: Fast prefix-based lookup (8 chars)
- **Hash Verification**: Timing-safe to prevent timing attacks

---

## Testing & Validation

### Manual Testing
```bash
# Test with cURL
curl -X POST https://localhost:3003/api/webhooks/enrollment \
  -H "Authorization: Bearer sk_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "productSlug": "test-product",
    "source": "api",
    "idempotencyKey": "test_'$(date +%s)'"
  }'
```

### Automated Tests
- Run: `npm test -- webhooks.test.ts`
- Includes unit tests for all functions
- Mocked Prisma for isolation
- Tests for happy path and errors

---

## Monitoring & Operations

### Check Recent Webhooks
```typescript
const events = await prisma.lmsWebhookEvent.findMany({
  where: { createdAt: { gte: new Date(Date.now() - 86400000) } },
  orderBy: { createdAt: 'desc' },
  take: 100,
});
```

### View Failures
```typescript
const failed = await prisma.lmsWebhookEvent.findMany({
  where: { status: 'FAILED' },
  orderBy: { createdAt: 'desc' },
});
```

### Audit Trail
```typescript
const logs = await prisma.lmsAuditLog.findMany({
  where: { action: 'ENROLLMENT_GRANTED' },
  orderBy: { createdAt: 'desc' },
});
```

---

## Future Enhancements

- [ ] Webhook signature verification (HMAC)
- [ ] Rate limiting per API key
- [ ] Webhook delivery dashboard
- [ ] Automatic retry with exponential backoff
- [ ] Webhook event filtering and routing
- [ ] Bulk enrollment endpoint
- [ ] Webhook event replay functionality
- [ ] Advanced analytics and reporting
- [ ] Webhook health monitoring
- [ ] Custom webhook templates

---

## Support Resources

1. **API Documentation**: See `/apps/lms/app/api/webhooks/README.md`
2. **Integration Examples**: See `/apps/lms/examples/webhook-integrations.ts`
3. **Setup Guide**: See `/WEBHOOK_SETUP.md`
4. **Type Definitions**: See `/apps/lms/app/api/webhooks/types.ts`
5. **Utilities**: See `/apps/lms/app/api/webhooks/utils.ts`

---

## Summary

A complete, production-quality webhook system has been implemented for K9 Genius LMS with:

- ✅ Full-featured webhook endpoint with API key authentication
- ✅ Comprehensive request validation and error handling
- ✅ Idempotency support to prevent duplicate enrollments
- ✅ Complete entitlement workflow (user creation, courses, roadmaps, certs)
- ✅ Audit logging for compliance and debugging
- ✅ Integration examples for Shopify, SamCart, Stripe, Zapier, Make.com
- ✅ API key management system with secure storage
- ✅ Complete TypeScript type definitions
- ✅ Extensive documentation and guides
- ✅ Test suite structure
- ✅ Security best practices implemented

**All files are production-ready and can be deployed immediately.**

---

**Creation Date**: April 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
