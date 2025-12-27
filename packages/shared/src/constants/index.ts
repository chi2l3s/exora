// Payment Statuses
export * from './payment-statuses';

// Error Codes
export * from './error-codes';

// Webhook Events
export * from './webhook-events';

// Currencies
export * from './currencies';

// API Configuration
export const API_VERSION = 'v1';
export const API_BASE_URL = 'https://api.exora.io';
export const CHECKOUT_BASE_URL = 'https://checkout.exora.io';

// API Key Prefixes
export const API_KEY_PREFIX_LIVE = 'exora_live_';
export const API_KEY_PREFIX_TEST = 'exora_test_';

// Rate Limits
export const DEFAULT_RATE_LIMIT = 1000; // requests per minute
export const BURST_RATE_LIMIT = 100; // requests per second

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Timeouts
export const PAYMENT_EXPIRY_MINUTES = 30;
export const SESSION_EXPIRY_DAYS = 7;
export const REFRESH_TOKEN_EXPIRY_DAYS = 30;
export const ACCESS_TOKEN_EXPIRY_MINUTES = 15;

// Webhook Configuration
export const WEBHOOK_TIMEOUT_MS = 30000; // 30 seconds
export const WEBHOOK_MAX_RETRIES = 6;

// ID Generation
export const PAYMENT_ID_PREFIX = 'pay_';
export const REFUND_ID_PREFIX = 'ref_';
export const CUSTOMER_ID_PREFIX = 'cus_';
export const SUBSCRIPTION_ID_PREFIX = 'sub_';
export const PLAN_ID_PREFIX = 'plan_';
export const PAYOUT_ID_PREFIX = 'po_';
export const INVOICE_ID_PREFIX = 'inv_';
export const WEBHOOK_ID_PREFIX = 'we_';
