import crypto from 'crypto';

/**
 * Generate a new API key with SHA-256 hashing
 * Returns { key, prefix, hash } for secure storage
 */
export function generateApiKey() {
  // Generate 32 random bytes and convert to hex string
  const key = crypto.randomBytes(32).toString('hex');

  // Use first 8 characters as prefix for quick lookup
  const prefix = key.substring(0, 8);

  // Hash the full key with SHA-256
  const hash = crypto.createHash('sha256').update(key).digest('hex');

  return {
    key: `sk_${key}`, // sk_ prefix for "secret key"
    prefix,
    hash,
  };
}

/**
 * Hash an existing API key (for verification)
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Verify an API key against a stored hash
 */
export function verifyApiKey(key: string, storedHash: string): boolean {
  const hash = hashApiKey(key);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

/**
 * Parse Authorization header and extract API key
 */
export function extractApiKeyFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Get API key prefix for database lookup
 */
export function getApiKeyPrefix(apiKey: string): string {
  // Remove sk_ prefix if present
  const key = apiKey.startsWith('sk_') ? apiKey.substring(3) : apiKey;
  return key.substring(0, 8);
}

/**
 * Webhook event logger helper
 */
export function logWebhookEvent(
  idempotencyKey: string,
  source: string,
  status: 'received' | 'processed' | 'failed',
  details?: any
) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] Webhook ${status.toUpperCase()} - ${source}:${idempotencyKey}`;

  if (status === 'failed') {
    console.error(message, details);
  } else {
    console.log(message, details ?? '');
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Normalize email (lowercase and trim)
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Generate a pending Clerk ID for users created via webhooks
 */
export function generatePendingClerkId(): string {
  return `pending_${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Source enum mapping
 */
export const SOURCE_ENUM_MAP: Record<string, string> = {
  shopify: 'SHOPIFY',
  samcart: 'SAMCART',
  stripe: 'STRIPE',
  zapier: 'ZAPIER',
  make: 'MAKE',
  api: 'API',
};

/**
 * Webhook response helpers
 */
export const webhookResponses = {
  success: (userId: string, entitlementId: string) => ({
    status: 'success',
    userId,
    entitlementId,
    message: 'Enrollment processed successfully',
  }),

  duplicate: (message = 'Webhook already processed') => ({
    status: 'duplicate',
    message,
  }),

  error: (message: string, details?: any) => ({
    status: 'error',
    message,
    ...(details && { details }),
  }),

  validationError: (message: string, errors?: any) => ({
    status: 'error',
    message: 'Invalid request body',
    validationMessage: message,
    ...(errors && { errors }),
  }),

  authError: (message = 'Authentication failed') => ({
    status: 'error',
    message,
  }),
};

/**
 * HTTP status code constants
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_ERROR: 500,
} as const;
