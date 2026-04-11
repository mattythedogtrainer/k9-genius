# K9 Genius LMS Webhook Endpoints

This directory contains webhook endpoints for external enrollment provisioning from payment processors (Shopify, SamCart, Stripe) and automation platforms (Zapier, Make.com).

## Overview

The enrollment webhook endpoint handles automated user creation and entitlements when customers purchase products through external payment processors.

### Key Features

- **Idempotency**: Duplicate requests are safely handled via idempotency keys
- **API Key Validation**: SHA-256 based API key verification
- **Automatic User Creation**: Creates new users if email doesn't exist
- **Entitlement Management**: Automatically grants product entitlements
- **Course Auto-Enrollment**: Users are auto-enrolled in linked courses
- **Roadmap Assignment**: Linked learning paths are auto-assigned
- **Certification Candidacy**: Users are set up for linked certifications
- **Audit Logging**: All actions are logged for compliance
- **Error Handling**: Comprehensive error tracking with retry support

## API Endpoints

### POST `/api/webhooks/enrollment`

Processes customer enrollments from external sources.

#### Authentication

```
Authorization: Bearer <api_key>
```

API keys are validated using SHA-256 hashing. The first 8 characters of the key (prefix) are used for quick database lookup.

#### Request Body

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "productSlug": "dog-training-fundamentals",
  "source": "shopify",
  "sourceRef": "order_12345",
  "idempotencyKey": "evt_unique_identifier_12345"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Customer email address |
| `firstName` | string | No | Customer first name |
| `lastName` | string | No | Customer last name |
| `productSlug` | string | Yes | Product identifier (slug) |
| `source` | enum | Yes | Payment source: `shopify`, `samcart`, `stripe`, `zapier`, `make`, `api` |
| `sourceRef` | string | No | Order ID or reference from payment processor |
| `idempotencyKey` | string | Yes | Unique identifier for request deduplication |

#### Response

**Success (200):**
```json
{
  "status": "success",
  "userId": "user_id_123",
  "entitlementId": "entitlement_id_456",
  "message": "Enrollment processed successfully"
}
```

**Duplicate (200):**
```json
{
  "status": "duplicate",
  "message": "Webhook already processed"
}
```

**Validation Error (400):**
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

**Authentication Error (401):**
```json
{
  "status": "error",
  "message": "API key verification failed"
}
```

**Server Error (500):**
```json
{
  "status": "error",
  "message": "Failed to process enrollment",
  "errorMessage": "Product not found: invalid-slug"
}
```

## Setup & Configuration

### 1. Create API Keys

API keys are generated and stored in the `LmsApiKey` table. Use the provided utility to generate secure keys:

```typescript
import { generateApiKey } from '@/app/api/webhooks/utils';

const { key, prefix, hash } = generateApiKey();

// Store in database:
// key: sk_<32_hex_chars> (give to customer)
// prefix: <8_char_prefix> (stored for lookup)
// hash: <sha256_hash> (for verification)
```

**Example API Key Creation:**
```typescript
const apiKey = await prisma.lmsApiKey.create({
  data: {
    name: 'Shopify Integration',
    prefix: 'sk_abc123', // from generateApiKey
    keyHash: '<sha256_hash>', // from generateApiKey
    permissions: ['enrollment:create'],
    isActive: true,
    createdBy: 'admin_user_id',
  },
});
```

### 2. Configure Payment Processor Webhooks

#### Shopify

1. Go to Settings > Apps and sales channels > Develop apps
2. Create a new app or select existing
3. Go to Configuration > Webhooks
4. Create a webhook:
   - Event: `Order paid`
   - URL: `https://yourdomain.com/api/webhooks/enrollment`
   - Add Authorization header: `Authorization: Bearer <your_api_key>`

**Shopify Payload Mapping:**
```javascript
// In your integration layer, map Shopify order to webhook format:
{
  "email": order.email,
  "firstName": order.shipping_address?.first_name,
  "lastName": order.shipping_address?.last_name,
  "productSlug": lineItem.sku, // or custom mapping
  "source": "shopify",
  "sourceRef": order.id,
  "idempotencyKey": `shop_${order.id}_${lineItem.id}`
}
```

#### SamCart

1. Dashboard > Integration Settings > Webhooks
2. Add webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/enrollment`
   - Event: `Purchase` or `Order Complete`

**SamCart Payload Mapping:**
```javascript
{
  "email": purchase.email,
  "firstName": purchase.first_name,
  "lastName": purchase.last_name,
  "productSlug": purchase.product_slug,
  "source": "samcart",
  "sourceRef": purchase.id,
  "idempotencyKey": `samcart_${purchase.id}`
}
```

#### Stripe

1. Dashboard > Webhooks
2. Add endpoint:
   - URL: `https://yourdomain.com/api/webhooks/enrollment`
   - Events: Select `checkout.session.completed`

**Stripe Payload Mapping:**
```javascript
{
  "email": session.customer_email,
  "firstName": session.customer_details?.name?.split(' ')[0],
  "lastName": session.customer_details?.name?.split(' ')[1],
  "productSlug": lineItem.description,
  "source": "stripe",
  "sourceRef": session.id,
  "idempotencyKey": `stripe_${session.id}`
}
```

### 3. Configure Zapier Integration

#### Setup Steps

1. Create a new Zapier app
2. Trigger: Choose your payment processor (Shopify, SamCart, etc.)
3. Filter (optional): Filter for specific products
4. Action: Use "Webhook" to POST to your endpoint

**Zapier Template:**

Trigger event data → Webhook POST:
```javascript
POST https://yourdomain.com/api/webhooks/enrollment

Headers:
{
  "Authorization": "Bearer <your_api_key>",
  "Content-Type": "application/json"
}

Body:
{
  "email": "{{customer_email}}",
  "firstName": "{{customer_first_name}}",
  "lastName": "{{customer_last_name}}",
  "productSlug": "{{product_slug}}",
  "source": "zapier",
  "sourceRef": "{{order_id}}",
  "idempotencyKey": "{{event_id}}"
}
```

### 4. Configure Make.com Integration

1. Create new scenario
2. Trigger: Choose payment processor or webhook trigger
3. Action: HTTP → Make a request

**Make Configuration:**

```
URL: https://yourdomain.com/api/webhooks/enrollment

Method: POST

Headers:
{
  "Authorization": "Bearer <your_api_key>",
  "Content-Type": "application/json"
}

Body:
{
  "email": "{{trigger.customer_email}}",
  "firstName": "{{trigger.first_name}}",
  "lastName": "{{trigger.last_name}}",
  "productSlug": "{{trigger.product_id}}",
  "source": "make",
  "sourceRef": "{{trigger.order_id}}",
  "idempotencyKey": "{{trigger.event_id}}"
}
```

## Database Schema

### LmsWebhookEvent

Tracks all webhook events for auditing and retry logic.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `source` | string | Payment source (shopify, samcart, stripe, etc.) |
| `eventType` | string | Type of event (enrollment, update, cancel) |
| `payload` | JSON | Full request payload |
| `idempotencyKey` | string | Unique key for deduplication |
| `status` | enum | PENDING, PROCESSING, COMPLETED, FAILED, DUPLICATE |
| `processedAt` | timestamp | When event was processed |
| `errorMessage` | string | Error details if failed |
| `retryCount` | int | Number of retry attempts |
| `createdAt` | timestamp | Event creation time |
| `updatedAt` | timestamp | Last update time |

### LmsApiKey

Stores API keys for webhook authentication.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `name` | string | Human-readable name |
| `keyHash` | string | SHA-256 hash of full key |
| `prefix` | string | First 8 chars for lookup |
| `permissions` | array | Scoped permissions |
| `isActive` | boolean | Whether key is active |
| `lastUsedAt` | timestamp | Last authentication time |
| `expiresAt` | timestamp | Expiration date |
| `createdAt` | timestamp | Creation time |
| `createdBy` | string | User who created key |

## Error Handling & Retries

### Automatic Retries

The webhook system tracks retry count. Integration platforms (Zapier, Make) should implement exponential backoff:

- Attempt 1: Immediate
- Attempt 2: 5 seconds
- Attempt 3: 30 seconds
- Attempt 4: 5 minutes
- Attempt 5: 30 minutes

### Common Errors

| Error | Cause | Resolution |
|-------|-------|-----------|
| `Product not found` | Invalid product slug | Verify product exists and slug is correct |
| `API key verification failed` | Invalid/expired key | Check API key, verify in LmsApiKey table |
| `Missing Authorization header` | No auth header | Add Authorization header to request |
| `Invalid email address` | Malformed email | Ensure email format is valid |
| `Invalid request body` | Missing required fields | Include all required fields (email, productSlug, etc.) |

### Idempotency

If a request is received multiple times with the same `idempotencyKey`:

1. First attempt: Processed normally (status: PENDING)
2. Duplicate: Returns 200 with status: duplicate
3. Previous failure: Returns 400 with error details

This prevents duplicate enrollments from network retries.

## Webhook Event Flow

```
1. External system sends POST request
   ↓
2. API key validation
   ↓
3. Request body validation (Zod)
   ↓
4. Idempotency check
   ↓
5. Create PENDING WebhookEvent record
   ↓
6. Find or create User
   ↓
7. Look up Product by slug
   ↓
8. Create/update Entitlement
   ↓
9. Auto-enroll in courses
   ↓
10. Assign roadmaps
    ↓
11. Create cert candidacies
    ↓
12. Log audit entry
    ↓
13. Mark event as COMPLETED
    ↓
14. Return 200 success
```

## Monitoring & Debugging

### Check Webhook Status

```typescript
const events = await prisma.lmsWebhookEvent.findMany({
  where: {
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 100,
});

// Group by status
const byStatus = events.reduce((acc, e) => {
  acc[e.status] = (acc[e.status] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Webhook status breakdown:', byStatus);
```

### Find Failed Events

```typescript
const failed = await prisma.lmsWebhookEvent.findMany({
  where: { status: 'FAILED' },
  orderBy: { createdAt: 'desc' },
});

failed.forEach(event => {
  console.log(`ID: ${event.id}`);
  console.log(`Source: ${event.source}`);
  console.log(`Error: ${event.errorMessage}`);
  console.log(`Payload: ${JSON.stringify(event.payload, null, 2)}`);
});
```

### Reprocess Failed Event

```typescript
await prisma.lmsWebhookEvent.update({
  where: { id: 'event_id' },
  data: {
    status: 'PENDING',
    retryCount: { increment: 1 },
    errorMessage: null,
    updatedAt: new Date(),
  },
});

// Then manually trigger processing or wait for retry cron job
```

## Testing

### Using cURL

```bash
curl -X POST https://localhost:3003/api/webhooks/enrollment \
  -H "Authorization: Bearer sk_test_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "productSlug": "test-product",
    "source": "api",
    "idempotencyKey": "test_'$(date +%s)'"
  }'
```

### Using TypeScript

```typescript
const response = await fetch('/api/webhooks/enrollment', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_test_key_here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    productSlug: 'test-product',
    source: 'api',
    idempotencyKey: `test_${Date.now()}`,
  }),
});

const data = await response.json();
console.log(data);
```

## Security Considerations

1. **API Key Storage**: Keys are hashed with SHA-256 before storage
2. **Key Validation**: Keys validated against hash using timing-safe comparison
3. **Email Normalization**: Emails are lowercased and trimmed
4. **Input Validation**: All inputs validated with Zod before processing
5. **Rate Limiting**: Implement rate limiting at the reverse proxy level
6. **HTTPS Only**: All webhooks must use HTTPS in production
7. **IP Whitelisting**: Consider whitelisting payment processor IPs
8. **CORS**: OPTIONS handler included for cross-origin requests

## Future Enhancements

- [ ] Webhook signature verification (HMAC)
- [ ] Rate limiting per API key
- [ ] Webhook delivery status dashboard
- [ ] Automatic retry with exponential backoff
- [ ] Webhook event filtering and routing
- [ ] Bulk enrollment endpoint
- [ ] Webhook event replay functionality
- [ ] Detailed webhook analytics and reporting
