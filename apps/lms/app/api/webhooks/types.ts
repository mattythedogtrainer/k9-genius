/**
 * Type definitions for webhook system
 */

// ============ WEBHOOK REQUEST TYPES ============

/**
 * Enrollment webhook payload received from external sources
 */
export interface EnrollmentWebhookPayload {
  email: string;
  firstName?: string;
  lastName?: string;
  productSlug: string;
  source: WebhookSource;
  sourceRef?: string;
  idempotencyKey: string;
}

/**
 * Valid webhook sources
 */
export type WebhookSource = 'shopify' | 'samcart' | 'stripe' | 'zapier' | 'make' | 'api';

/**
 * Maps webhook source to Prisma enum value
 */
export type EntitlementSourceEnum = 'SHOPIFY' | 'SAMCART' | 'STRIPE' | 'ZAPIER' | 'MAKE' | 'API';

// ============ WEBHOOK RESPONSE TYPES ============

/**
 * Success response
 */
export interface WebhookSuccessResponse {
  status: 'success';
  userId: string;
  entitlementId: string;
  message: string;
}

/**
 * Duplicate request response
 */
export interface WebhookDuplicateResponse {
  status: 'duplicate';
  message: string;
}

/**
 * Error response
 */
export interface WebhookErrorResponse {
  status: 'error';
  message: string;
  errorMessage?: string;
  details?: any;
}

/**
 * Union of all webhook responses
 */
export type WebhookResponse =
  | WebhookSuccessResponse
  | WebhookDuplicateResponse
  | WebhookErrorResponse;

// ============ API KEY TYPES ============

/**
 * API key generation result
 */
export interface GeneratedApiKey {
  key: string; // Format: sk_<32_hex_chars>
  prefix: string; // First 8 chars for lookup
  hash: string; // SHA-256 hash of full key
}

/**
 * API key validation result
 */
export interface ApiKeyValidation {
  valid: boolean;
  error?: string;
}

// ============ WEBHOOK EVENT TYPES ============

/**
 * Webhook event status
 */
export type WebhookEventStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'DUPLICATE';

/**
 * Webhook event type
 */
export type WebhookEventType = 'enrollment' | 'update' | 'cancel';

/**
 * Database webhook event record (mirrors Prisma model)
 */
export interface WebhookEvent {
  id: string;
  source: string;
  eventType: string;
  payload: Record<string, any>;
  idempotencyKey: string;
  status: WebhookEventStatus;
  processedAt?: Date;
  errorMessage?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ ENTITLEMENT TYPES ============

/**
 * User entitlement data
 */
export interface UserEntitlementData {
  id: string;
  userId: string;
  productId: string;
  source: EntitlementSourceEnum;
  sourceRef?: string;
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============ AUDIT LOG TYPES ============

/**
 * Audit log entry for webhook actions
 */
export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string; // e.g., 'ENROLLMENT_GRANTED'
  entityType: string; // e.g., 'ENTITLEMENT'
  entityId?: string;
  metadata?: Record<string, any>;
  source: string; // e.g., 'webhook:shopify'
  ipAddress?: string;
  createdAt: Date;
}

// ============ WEBHOOK HANDLER TYPES ============

/**
 * Function signature for webhook handlers
 */
export type WebhookHandler = (payload: EnrollmentWebhookPayload) => Promise<WebhookSuccessResponse>;

/**
 * Webhook handler options
 */
export interface WebhookHandlerOptions {
  validateApiKey?: boolean;
  logRequest?: boolean;
  logResponse?: boolean;
}

// ============ ERROR TYPES ============

/**
 * Custom webhook error
 */
export class WebhookError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'WebhookError';
  }
}

/**
 * Validation error from Zod
 */
export interface ValidationError {
  path: (string | number)[];
  message: string;
}

// ============ CONFIGURATION TYPES ============

/**
 * Webhook endpoint configuration
 */
export interface WebhookConfig {
  apiKeyRequired: boolean;
  validateSignature?: boolean;
  retryPolicy?: {
    maxAttempts: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  };
  rateLimit?: {
    perMinute: number;
    perHour: number;
  };
}

// ============ LOGGING TYPES ============

/**
 * Webhook event log entry
 */
export interface WebhookLog {
  timestamp: string;
  idempotencyKey: string;
  source: string;
  action: 'received' | 'processed' | 'failed';
  details?: any;
  error?: string;
  durationMs?: number;
}

// ============ INTEGRATION TYPE HELPERS ============

/**
 * Type-safe source mapping
 */
export const SOURCE_MAP: Record<WebhookSource, EntitlementSourceEnum> = {
  shopify: 'SHOPIFY',
  samcart: 'SAMCART',
  stripe: 'STRIPE',
  zapier: 'ZAPIER',
  make: 'MAKE',
  api: 'API',
};

/**
 * Reverse mapping
 */
export const ENUM_SOURCE_MAP: Record<EntitlementSourceEnum, WebhookSource> = {
  SHOPIFY: 'shopify',
  SAMCART: 'samcart',
  STRIPE: 'stripe',
  ZAPIER: 'zapier',
  MAKE: 'make',
  API: 'api',
};

/**
 * Type guard for webhook source
 */
export function isWebhookSource(value: any): value is WebhookSource {
  return ['shopify', 'samcart', 'stripe', 'zapier', 'make', 'api'].includes(value);
}

/**
 * Type guard for entitlement source enum
 */
export function isEntitlementSourceEnum(value: any): value is EntitlementSourceEnum {
  return ['SHOPIFY', 'SAMCART', 'STRIPE', 'ZAPIER', 'MAKE', 'API'].includes(value);
}

/**
 * Type guard for webhook event status
 */
export function isWebhookEventStatus(value: any): value is WebhookEventStatus {
  return ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'DUPLICATE'].includes(value);
}

// ============ CONSTANTS ============

/**
 * Webhook configuration defaults
 */
export const WEBHOOK_CONFIG_DEFAULTS: WebhookConfig = {
  apiKeyRequired: true,
  validateSignature: false,
  retryPolicy: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 60000,
    backoffMultiplier: 2,
  },
  rateLimit: {
    perMinute: 100,
    perHour: 5000,
  },
};

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Webhook error codes
 */
export const WEBHOOK_ERROR_CODES = {
  // Authentication
  MISSING_AUTH_HEADER: 'MISSING_AUTH_HEADER',
  INVALID_AUTH_FORMAT: 'INVALID_AUTH_FORMAT',
  INVALID_API_KEY: 'INVALID_API_KEY',
  API_KEY_EXPIRED: 'API_KEY_EXPIRED',
  API_KEY_INACTIVE: 'API_KEY_INACTIVE',

  // Validation
  INVALID_REQUEST_BODY: 'INVALID_REQUEST_BODY',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_SOURCE: 'INVALID_SOURCE',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

  // Business Logic
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  USER_CREATION_FAILED: 'USER_CREATION_FAILED',
  ENTITLEMENT_CREATION_FAILED: 'ENTITLEMENT_CREATION_FAILED',

  // Processing
  IDEMPOTENCY_CONFLICT: 'IDEMPOTENCY_CONFLICT',
  PROCESSING_ERROR: 'PROCESSING_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',

  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

/**
 * HTTP status code for each error code
 */
export const ERROR_CODE_STATUS_MAP: Record<string, number> = {
  MISSING_AUTH_HEADER: 401,
  INVALID_AUTH_FORMAT: 401,
  INVALID_API_KEY: 401,
  API_KEY_EXPIRED: 401,
  API_KEY_INACTIVE: 401,
  INVALID_REQUEST_BODY: 400,
  INVALID_EMAIL: 400,
  INVALID_SOURCE: 400,
  MISSING_REQUIRED_FIELD: 400,
  PRODUCT_NOT_FOUND: 400,
  USER_CREATION_FAILED: 500,
  ENTITLEMENT_CREATION_FAILED: 500,
  IDEMPOTENCY_CONFLICT: 409,
  PROCESSING_ERROR: 500,
  DATABASE_ERROR: 500,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============ EXPORT TYPES ============

export type {
  EnrollmentWebhookPayload,
  WebhookResponse,
  GeneratedApiKey,
  WebhookEvent,
  UserEntitlementData,
  AuditLogEntry,
};
