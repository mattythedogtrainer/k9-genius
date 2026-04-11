# K9 Genius LMS Webhook Endpoint - Setup Guide

## Overview

A production-quality webhook endpoint has been created for K9 Genius LMS to handle external enrollment provisioning from payment processors (Shopify, SamCart, Stripe) and automation platforms (Zapier, Make.com).

## Files Created

### Core Endpoint

```
/apps/lms/app/api/webhooks/enrollment/route.ts
```

The main webhook handler with:
- POST endpoint for enrollment processing
- API key validation with SHA-256 hashing
- Request validation with Zod
- Idempotency checking
- Full entitlement granting workflow
- Error handling and audit logging
- OPTIONS handler for CORS

**Key Features:**
- Validates API key from Authorization header
- Checks for duplicate requests via idempotency key
- Creates/finds users by email
- Looks up products by slug
- Grants entitlements automatically
- Auto-enrolls users in linked courses
- Assigns linked roadmaps
- Creates certification candidacies
- Logs all actions for auditing
- Returns proper HTTP status codes

### Utilities & Helpers

```
/apps/lms/app/api/webhooks/utils.ts
```

Helper functions including:
- `generateApiKey()` - Creates new API keys with SHA-256 hashing
- `hashApiKey()` - Hashes an API key
- `verifyApiKey()` - Safely compares key hashes
- `extractApiKeyFromHeader()` - Parses Authorization header
- `getApiKeyPrefix()` - Gets 8-char prefix for lookup
- `logWebhookEvent()` - Consistent webhook logging
- `normalizeEmail()` - Standardizes email addresses
- `generatePendingClerkId()` - Creates placeholder IDs for new users
- Response helpers for consistent API responses

### Type Definitions

```
/apps/lms/app/api/webhooks/types.ts
```

TypeScript interfaces and types:
- `EnrollmentWebhookPayload` - Request schema
- `WebhookResponse` - Union of response types
- `WebhookSource` - Valid payment sources
- `WebhookEvent` - Database event record
- `GeneratedApiKey` - Key generation result
- `ValidationError` - Error structure
- Type guards and constants for error handling
- Source mapping enums

### Documentation

```
/apps/lms/app/api/webhooks/README.md
```

Comprehensive documentation including:
- API endpoint reference
- Authentication setup
- Payment processor configuration (Shopify, SamCart, Stripe)
- Zapier and Make.com setup guides
- Database schema documentation
- Error handling and retry strategies
- Monitoring and debugging tips
- Security considerations
- Testing examples with cURL and TypeScript

### Scripts & Tools

```
/apps/lms/scripts/create-webhook-api-key.ts
```

Script to generate API keys:
```bash
npx ts-node scripts/create-webhook-api-key.ts "Integration Name" [--expiry-days N]
```

### Integration Examples

```
/apps/lms/examples/webhook-integrations.ts
```

Complete implementation examples:
- Shopify webhook handler
- SamCart webhook handler
- Stripe webhook handler
- Zapier configuration template
- Make.com configuration template
- Node.js/Express server example
- Retry logic with exponential backoff
- Test utilities and payload generation

### Test Suite

```
/apps/lms/__tests__/webhooks.test.ts
```

Unit test structure with test cases for:
- API key generation and validation
- Request validation
- Idempotency handling
- User creation and lookup
- Product lookup
- Entitlement granting
- Course auto-enrollment
- Roadmap assignment
- Certification candidacy creation
- Audit logging
- Error handling
- End-to-end workflows
- Edge cases

## Quick Start

### 1. Create an API Key

```bash
cd apps/lms
npx ts-node scripts/create-webhook-api-key.ts "Shopify Integration"
```

Save the returned API key securely.

### 2. Configure Database

Ensure these tables exist (they should in your Prisma schema):
- `LmsApiKey`
- `LmsWebhookEvent`
- `LmsUserEntitlement`
- `LmsProduct`
- `LmsEnrollment`
- `LmsUserRoadmapProgress`
- `LmsCertCandidacy`
- `LmsAuditLog`

### 3. Set Up Payment Processor

#### Shopify
- Go to Settings > Apps and sales channels > Develop apps
- Create webhook for "Order paid" event
- URL: `https://yourdomain.com/api/webhooks/enrollment`
- Add header: `Authorization: Bearer <your_api_key>`

#### SamCart
- Dashboard > Integration Settings > Webhooks
- Add webhook endpoint: `https://yourdomain.com/api/webhooks/enrollment`
- Event: `Purchase` or `Order Complete`
- Include header: `Authorization: Bearer <your_api_key>`

#### Stripe
- Dashboard > Webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/enrollment`
- Events: `checkout.session.completed`
- Include header: `Authorization: Bearer <your_api_key>`

#### Zapier
- Create new Zap with payment processor trigger
- Action: Webhook → Make a request
- Method: POST
- URL: `https://yourdomain.com/api/webhooks/enrollment`
- Headers: `Authorization: Bearer <your_api_key>`
- Body: Map trigger data to webhook format

#### Make.com
- Create new scenario with trigger
- Action: HTTP → Make a request
- URL: `https://yourdomain.com/api/webhooks/enrollment`
- Method: POST
- Headers: `Authorization: Bearer <your_api_key>`
- Body: JSON with mapped data

### 4. Test the Endpoint

```bash
curl -X POST https://localhost:3003/api/webhooks/enrollment \
  -H "Authorization: Bearer sk_<your_api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "productSlug": "your-product-slug",
    "source": "api",
    "idempotencyKey": "test_'$(date +%s)'"
  }'
```

## Endpoint Details

### Request

```
POST /api/webhooks/enrollment
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "productSlug": "dog-training-fundamentals",
  "source": "shopify|samcart|stripe|zapier|make|api",
  "sourceRef": "order_12345",
  "idempotencyKey": "unique_event_id"
}
```

### Response (Success)

```json
{
  "status": "success",
  "userId": "user_id_123",
  "entitlementId": "entitlement_id_456",
  "message": "Enrollment processed successfully"
}
```

### Response (Duplicate)

```json
{
  "status": "duplicate",
  "message": "Webhook already processed"
}
```

### Response (Error)

```json
{
  "status": "error",
  "message": "Failed to process enrollment",
  "errorMessage": "Product not found"
}
```

## Security Features

1. **API Key Validation**: SHA-256 hashing with timing-safe comparison
2. **Input Validation**: Zod schema validation for all inputs
3. **Idempotency**: Prevents duplicate enrollments from network retries
4. **Audit Logging**: All actions logged to `LmsAuditLog`
5. **Error Handling**: Comprehensive error tracking with retry info
6. **Email Normalization**: Prevents case-sensitive duplicates
7. **HTTPS Only**: Should be enforced at reverse proxy level
8. **CORS Support**: OPTIONS handler for cross-origin requests

## Database Schema

### LmsWebhookEvent
Tracks all webhook events for auditing and retry logic.

### LmsApiKey
Stores hashed API keys with metadata:
- `name`: Human-readable identifier
- `keyHash`: SHA-256 hash of full key
- `prefix`: First 8 chars for lookup
- `permissions`: Array of allowed actions
- `isActive`: Whether key is active
- `expiresAt`: Optional expiration date
- `lastUsedAt`: Track usage

## Monitoring & Debugging

### Check Recent Webhooks

```typescript
const events = await prisma.lmsWebhookEvent.findMany({
  where: {
    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  orderBy: { createdAt: 'desc' },
  take: 100,
});
```

### Find Failed Events

```typescript
const failed = await prisma.lmsWebhookEvent.findMany({
  where: { status: 'FAILED' },
  orderBy: { createdAt: 'desc' },
});
```

### View Audit Trail

```typescript
const logs = await prisma.lmsAuditLog.findMany({
  where: { action: 'ENROLLMENT_GRANTED' },
  orderBy: { createdAt: 'desc' },
});
```

## Performance Considerations

- **Database Indexes**: Webhook endpoint uses indexed fields (idempotencyKey, status)
- **Upsert Operations**: Prevents duplicate enrollments efficiently
- **Batch Processing**: Handles multiple courses/roadmaps/certs in single transaction
- **API Key Lookup**: Fast prefix-based lookup before full hash verification

## Next Steps

1. Create API keys for each integration
2. Configure payment processor webhooks
3. Test with sample data
4. Monitor webhook dashboard
5. Implement retry logic in payment processors
6. Set up alerting for failed webhooks

## Support & Troubleshooting

### Common Issues

**"API key verification failed"**
- Ensure key is stored correctly in database
- Check key hasn't expired
- Verify key is active (`isActive: true`)

**"Product not found"**
- Verify product exists in `LmsProduct` table
- Check product slug matches exactly (case-sensitive)
- Ensure product is marked as active

**"Idempotency conflict"**
- Different webhook events must have unique idempotency keys
- Use order ID + line item ID combination for uniqueness

**"User creation failed"**
- Check email address is valid
- Ensure no duplicate email in `User` table already
- Verify role 'CONSUMER' exists in enum

## Additional Resources

- See `/apps/lms/app/api/webhooks/README.md` for detailed API documentation
- See `/apps/lms/examples/webhook-integrations.ts` for integration examples
- See `/apps/lms/scripts/create-webhook-api-key.ts` for key generation
- Check test suite in `/__tests__/webhooks.test.ts` for patterns

---

**Created**: 2024
**Version**: 1.0.0
**Status**: Production Ready
