/**
 * Example Webhook Integration Patterns
 *
 * These examples show how to integrate K9 Genius enrollment webhooks
 * with different payment processors and automation platforms.
 */

// ============ SHOPIFY INTEGRATION ============

/**
 * Shopify order webhook handler
 * Triggered on: checkout.session.completed or order.paid
 */
export async function handleShopifyOrderWebhook(shopifyOrder: any) {
  const baseUrl = process.env.K9_GENIUS_WEBHOOK_URL || 'https://lms.yourdomain.com';
  const apiKey = process.env.K9_GENIUS_API_KEY;

  for (const lineItem of shopifyOrder.line_items) {
    // Map your Shopify product to K9 Genius product slug
    // You might store this mapping in a custom app field or database
    const k9ProductSlug = mapShopifyProductToK9(lineItem.sku, lineItem.product_id);

    if (!k9ProductSlug) {
      console.warn(`No K9 mapping found for Shopify product: ${lineItem.sku}`);
      continue;
    }

    const payload = {
      email: shopifyOrder.email,
      firstName: shopifyOrder.shipping_address?.first_name,
      lastName: shopifyOrder.shipping_address?.last_name,
      productSlug: k9ProductSlug,
      source: 'shopify',
      sourceRef: shopifyOrder.id,
      idempotencyKey: `shopify_${shopifyOrder.id}_${lineItem.id}`,
    };

    try {
      const response = await fetch(`${baseUrl}/api/webhooks/enrollment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✓ Shopify enrollment processed: ${shopifyOrder.email} -> ${k9ProductSlug}`);
      } else {
        console.error(`✗ Failed to process Shopify enrollment:`, result);
      }
    } catch (error) {
      console.error(`✗ Error calling K9 Genius webhook:`, error);
      // In production, implement retry logic here
    }
  }
}

// Placeholder for mapping logic (implement based on your products)
function mapShopifyProductToK9(sku: string, productId: string): string | null {
  const mapping: Record<string, string> = {
    'SKU-TRAINING-101': 'dog-training-fundamentals',
    'SKU-ADVANCED-201': 'advanced-dog-training',
    'SKU-PUPPY-001': 'puppy-training-essentials',
    // Add your mappings here
  };

  return mapping[sku] || null;
}

// ============ SAMCART INTEGRATION ============

/**
 * SamCart purchase webhook handler
 * Triggered on: Order Complete or Purchase Success
 */
export async function handleSamCartPurchaseWebhook(samcartPurchase: any) {
  const baseUrl = process.env.K9_GENIUS_WEBHOOK_URL || 'https://lms.yourdomain.com';
  const apiKey = process.env.K9_GENIUS_API_KEY;

  // SamCart provides product_id, map to K9 slug
  const k9ProductSlug = mapSamCartProductToK9(samcartPurchase.product_id);

  if (!k9ProductSlug) {
    console.warn(`No K9 mapping found for SamCart product: ${samcartPurchase.product_id}`);
    return;
  }

  const [firstName, ...lastNameParts] = (samcartPurchase.customer_name || '').split(' ');
  const lastName = lastNameParts.join(' ');

  const payload = {
    email: samcartPurchase.customer_email,
    firstName,
    lastName: lastName || undefined,
    productSlug: k9ProductSlug,
    source: 'samcart',
    sourceRef: samcartPurchase.id,
    idempotencyKey: `samcart_${samcartPurchase.id}`,
  };

  try {
    const response = await fetch(`${baseUrl}/api/webhooks/enrollment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✓ SamCart enrollment processed: ${samcartPurchase.customer_email} -> ${k9ProductSlug}`);
    } else {
      console.error(`✗ Failed to process SamCart enrollment:`, result);
    }
  } catch (error) {
    console.error(`✗ Error calling K9 Genius webhook:`, error);
  }
}

function mapSamCartProductToK9(samcartProductId: string): string | null {
  const mapping: Record<string, string> = {
    '12345': 'dog-training-fundamentals',
    '12346': 'advanced-dog-training',
    // Add your mappings
  };

  return mapping[samcartProductId] || null;
}

// ============ STRIPE INTEGRATION ============

/**
 * Stripe webhook handler for payment intents or checkout sessions
 */
export async function handleStripeWebhook(stripeEvent: any) {
  const baseUrl = process.env.K9_GENIUS_WEBHOOK_URL || 'https://lms.yourdomain.com';
  const apiKey = process.env.K9_GENIUS_API_KEY;

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;

    // Retrieve line items to map products
    const lineItems = session.line_items?.data || [];

    for (const lineItem of lineItems) {
      const k9ProductSlug = mapStripeProductToK9(lineItem.description || lineItem.product);

      if (!k9ProductSlug) {
        console.warn(`No K9 mapping found for Stripe product: ${lineItem.product}`);
        continue;
      }

      const [firstName, ...lastNameParts] = (session.customer_details?.name || '').split(' ');
      const lastName = lastNameParts.join(' ');

      const payload = {
        email: session.customer_details?.email || session.customer_email,
        firstName,
        lastName: lastName || undefined,
        productSlug: k9ProductSlug,
        source: 'stripe',
        sourceRef: session.id,
        idempotencyKey: `stripe_${session.id}_${lineItem.id}`,
      };

      try {
        const response = await fetch(`${baseUrl}/api/webhooks/enrollment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          console.log(`✓ Stripe enrollment processed: ${payload.email} -> ${k9ProductSlug}`);
        } else {
          console.error(`✗ Failed to process Stripe enrollment:`, result);
        }
      } catch (error) {
        console.error(`✗ Error calling K9 Genius webhook:`, error);
      }
    }
  }
}

function mapStripeProductToK9(stripeProductName: string): string | null {
  const mapping: Record<string, string> = {
    'Dog Training Fundamentals': 'dog-training-fundamentals',
    'Advanced Dog Training': 'advanced-dog-training',
    'Puppy Training Essentials': 'puppy-training-essentials',
  };

  return mapping[stripeProductName] || null;
}

// ============ ZAPIER INTEGRATION GUIDE ============

/**
 * This is a template configuration for Zapier.
 *
 * Setup Steps:
 * 1. Create a new Zapier Zap
 * 2. Choose trigger (Shopify Order, SamCart Purchase, etc.)
 * 3. Map trigger data to this structure
 * 4. Use Webhook action (custom request)
 *
 * Configuration:
 * - Method: POST
 * - URL: https://yourdomain.com/api/webhooks/enrollment
 * - Auth: Bearer Token (set in Headers)
 * - Headers:
 *     Authorization: Bearer <your_api_key>
 *     Content-Type: application/json
 * - Body (Raw):
 */

export const ZAPIER_WEBHOOK_BODY = `{
  "email": "{{trigger.customer_email}}",
  "firstName": "{{trigger.customer_first_name}}",
  "lastName": "{{trigger.customer_last_name}}",
  "productSlug": "{{trigger.product_slug}}",
  "source": "zapier",
  "sourceRef": "{{trigger.order_id}}",
  "idempotencyKey": "{{trigger.event_id}}"
}`;

// ============ MAKE.COM INTEGRATION GUIDE ============

/**
 * Template for Make.com (formerly Integromat) scenario
 *
 * Setup Steps:
 * 1. Create new scenario
 * 2. Add trigger (HTTP webhook or payment processor)
 * 3. Add action: HTTP → Make a request
 *
 * Configuration:
 * - URL: https://yourdomain.com/api/webhooks/enrollment
 * - Method: POST
 * - Headers:
 *     Authorization: Bearer <your_api_key>
 * - Body type: JSON
 * - Request content:
 */

export const MAKE_WEBHOOK_BODY = `{
  "email": "{{trigger.email}}",
  "firstName": "{{trigger.firstName}}",
  "lastName": "{{trigger.lastName}}",
  "productSlug": "{{trigger.productSlug}}",
  "source": "make",
  "sourceRef": "{{trigger.orderId}}",
  "idempotencyKey": "{{trigger.eventId}}"
}`;

// ============ NODEJS SERVER EXAMPLE ============

/**
 * Express/Node.js server receiving webhooks from payment processors
 * and forwarding to K9 Genius
 */

import express from 'express';

const app = express();
app.use(express.json());

// Shopify webhook endpoint
app.post('/webhooks/shopify/order-paid', async (req, res) => {
  try {
    await handleShopifyOrderWebhook(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Shopify webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SamCart webhook endpoint
app.post('/webhooks/samcart/purchase', async (req, res) => {
  try {
    await handleSamCartPurchaseWebhook(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('SamCart webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Stripe webhook endpoint
app.post('/webhooks/stripe/event', async (req, res) => {
  try {
    await handleStripeWebhook(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============ ERROR HANDLING & RETRY LOGIC ============

/**
 * Generic webhook handler with retry logic
 */
async function sendWebhookWithRetry(
  payload: any,
  maxRetries = 3,
  delayMs = 1000
): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `${process.env.K9_GENIUS_WEBHOOK_URL}/api/webhooks/enrollment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.K9_GENIUS_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        return await response.json();
      }

      // Don't retry on 4xx errors (validation issues)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const nextDelay = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`Retry attempt ${attempt + 1} in ${nextDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, nextDelay));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// ============ TESTING UTILITIES ============

/**
 * Generate test data for webhook testing
 */
export function generateTestPayload(overrides: Partial<any> = {}) {
  const timestamp = Date.now();

  return {
    email: `test+${timestamp}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    productSlug: 'dog-training-fundamentals',
    source: 'api',
    sourceRef: `test_${timestamp}`,
    idempotencyKey: `test_${timestamp}`,
    ...overrides,
  };
}

/**
 * Test webhook endpoint
 */
export async function testWebhook(
  apiKey: string,
  webhookUrl: string,
  payload: any = null
) {
  const testPayload = payload || generateTestPayload();

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data,
      payload: testPayload,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      payload: testPayload,
    };
  }
}
