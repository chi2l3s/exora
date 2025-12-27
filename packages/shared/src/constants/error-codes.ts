// Error Codes
export const ERROR_CODES = {
  // Authentication Errors (1xxx)
  AUTHENTICATION_REQUIRED: 'authentication_required',
  INVALID_API_KEY: 'invalid_api_key',
  API_KEY_EXPIRED: 'api_key_expired',
  API_KEY_REVOKED: 'api_key_revoked',
  INVALID_TOKEN: 'invalid_token',
  TOKEN_EXPIRED: 'token_expired',
  TWO_FACTOR_REQUIRED: 'two_factor_required',
  INVALID_TWO_FACTOR_CODE: 'invalid_two_factor_code',
  PERMISSION_DENIED: 'permission_denied',

  // Validation Errors (2xxx)
  VALIDATION_ERROR: 'validation_error',
  INVALID_PARAMETER: 'invalid_parameter',
  MISSING_PARAMETER: 'missing_parameter',
  INVALID_AMOUNT: 'invalid_amount',
  INVALID_CURRENCY: 'invalid_currency',
  INVALID_EMAIL: 'invalid_email',
  INVALID_PHONE: 'invalid_phone',
  INVALID_URL: 'invalid_url',

  // Resource Errors (3xxx)
  RESOURCE_NOT_FOUND: 'resource_not_found',
  PAYMENT_NOT_FOUND: 'payment_not_found',
  REFUND_NOT_FOUND: 'refund_not_found',
  CUSTOMER_NOT_FOUND: 'customer_not_found',
  SUBSCRIPTION_NOT_FOUND: 'subscription_not_found',
  WEBHOOK_NOT_FOUND: 'webhook_not_found',
  PROJECT_NOT_FOUND: 'project_not_found',
  DUPLICATE_RESOURCE: 'duplicate_resource',
  DUPLICATE_ORDER_ID: 'duplicate_order_id',

  // Payment Errors (4xxx)
  PAYMENT_FAILED: 'payment_failed',
  PAYMENT_DECLINED: 'payment_declined',
  CARD_DECLINED: 'card_declined',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  CARD_EXPIRED: 'card_expired',
  INVALID_CARD: 'invalid_card',
  FRAUD_SUSPECTED: 'fraud_suspected',
  PAYMENT_CANCELLED: 'payment_cancelled',
  PAYMENT_EXPIRED: 'payment_expired',
  CAPTURE_FAILED: 'capture_failed',
  INVALID_PAYMENT_STATUS: 'invalid_payment_status',

  // Refund Errors (5xxx)
  REFUND_FAILED: 'refund_failed',
  REFUND_AMOUNT_EXCEEDED: 'refund_amount_exceeded',
  PAYMENT_NOT_REFUNDABLE: 'payment_not_refundable',
  REFUND_ALREADY_PROCESSED: 'refund_already_processed',

  // Subscription Errors (6xxx)
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_PAST_DUE: 'subscription_past_due',
  SUBSCRIPTION_PAYMENT_FAILED: 'subscription_payment_failed',
  PLAN_NOT_FOUND: 'plan_not_found',

  // Payout Errors (7xxx)
  PAYOUT_FAILED: 'payout_failed',
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  PAYOUT_LIMIT_EXCEEDED: 'payout_limit_exceeded',
  INVALID_BANK_ACCOUNT: 'invalid_bank_account',

  // Rate Limiting (8xxx)
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  TOO_MANY_REQUESTS: 'too_many_requests',

  // Merchant Errors (9xxx)
  MERCHANT_NOT_VERIFIED: 'merchant_not_verified',
  MERCHANT_SUSPENDED: 'merchant_suspended',
  MERCHANT_BLOCKED: 'merchant_blocked',
  DAILY_LIMIT_EXCEEDED: 'daily_limit_exceeded',
  MONTHLY_LIMIT_EXCEEDED: 'monthly_limit_exceeded',
  TRANSACTION_LIMIT_EXCEEDED: 'transaction_limit_exceeded',

  // System Errors (10xxx)
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  GATEWAY_ERROR: 'gateway_error',
  TIMEOUT: 'timeout',
  IDEMPOTENCY_KEY_IN_USE: 'idempotency_key_in_use',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// Error Messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // Authentication
  [ERROR_CODES.AUTHENTICATION_REQUIRED]: 'Authentication is required',
  [ERROR_CODES.INVALID_API_KEY]: 'Invalid API key',
  [ERROR_CODES.API_KEY_EXPIRED]: 'API key has expired',
  [ERROR_CODES.API_KEY_REVOKED]: 'API key has been revoked',
  [ERROR_CODES.INVALID_TOKEN]: 'Invalid token',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Token has expired',
  [ERROR_CODES.TWO_FACTOR_REQUIRED]: 'Two-factor authentication is required',
  [ERROR_CODES.INVALID_TWO_FACTOR_CODE]: 'Invalid two-factor code',
  [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied',

  // Validation
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation error',
  [ERROR_CODES.INVALID_PARAMETER]: 'Invalid parameter',
  [ERROR_CODES.MISSING_PARAMETER]: 'Missing required parameter',
  [ERROR_CODES.INVALID_AMOUNT]: 'Invalid amount',
  [ERROR_CODES.INVALID_CURRENCY]: 'Invalid currency',
  [ERROR_CODES.INVALID_EMAIL]: 'Invalid email address',
  [ERROR_CODES.INVALID_PHONE]: 'Invalid phone number',
  [ERROR_CODES.INVALID_URL]: 'Invalid URL',

  // Resources
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ERROR_CODES.PAYMENT_NOT_FOUND]: 'Payment not found',
  [ERROR_CODES.REFUND_NOT_FOUND]: 'Refund not found',
  [ERROR_CODES.CUSTOMER_NOT_FOUND]: 'Customer not found',
  [ERROR_CODES.SUBSCRIPTION_NOT_FOUND]: 'Subscription not found',
  [ERROR_CODES.WEBHOOK_NOT_FOUND]: 'Webhook endpoint not found',
  [ERROR_CODES.PROJECT_NOT_FOUND]: 'Project not found',
  [ERROR_CODES.DUPLICATE_RESOURCE]: 'Resource already exists',
  [ERROR_CODES.DUPLICATE_ORDER_ID]: 'Order ID already exists',

  // Payments
  [ERROR_CODES.PAYMENT_FAILED]: 'Payment failed',
  [ERROR_CODES.PAYMENT_DECLINED]: 'Payment was declined',
  [ERROR_CODES.CARD_DECLINED]: 'Card was declined',
  [ERROR_CODES.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [ERROR_CODES.CARD_EXPIRED]: 'Card has expired',
  [ERROR_CODES.INVALID_CARD]: 'Invalid card details',
  [ERROR_CODES.FRAUD_SUSPECTED]: 'Transaction flagged as potentially fraudulent',
  [ERROR_CODES.PAYMENT_CANCELLED]: 'Payment was cancelled',
  [ERROR_CODES.PAYMENT_EXPIRED]: 'Payment has expired',
  [ERROR_CODES.CAPTURE_FAILED]: 'Failed to capture payment',
  [ERROR_CODES.INVALID_PAYMENT_STATUS]: 'Invalid payment status for this operation',

  // Refunds
  [ERROR_CODES.REFUND_FAILED]: 'Refund failed',
  [ERROR_CODES.REFUND_AMOUNT_EXCEEDED]: 'Refund amount exceeds available balance',
  [ERROR_CODES.PAYMENT_NOT_REFUNDABLE]: 'Payment cannot be refunded',
  [ERROR_CODES.REFUND_ALREADY_PROCESSED]: 'Refund has already been processed',

  // Subscriptions
  [ERROR_CODES.SUBSCRIPTION_CANCELLED]: 'Subscription has been cancelled',
  [ERROR_CODES.SUBSCRIPTION_PAST_DUE]: 'Subscription payment is past due',
  [ERROR_CODES.SUBSCRIPTION_PAYMENT_FAILED]: 'Subscription payment failed',
  [ERROR_CODES.PLAN_NOT_FOUND]: 'Subscription plan not found',

  // Payouts
  [ERROR_CODES.PAYOUT_FAILED]: 'Payout failed',
  [ERROR_CODES.INSUFFICIENT_BALANCE]: 'Insufficient balance',
  [ERROR_CODES.PAYOUT_LIMIT_EXCEEDED]: 'Payout limit exceeded',
  [ERROR_CODES.INVALID_BANK_ACCOUNT]: 'Invalid bank account details',

  // Rate Limiting
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many requests',

  // Merchant
  [ERROR_CODES.MERCHANT_NOT_VERIFIED]: 'Merchant is not verified',
  [ERROR_CODES.MERCHANT_SUSPENDED]: 'Merchant account is suspended',
  [ERROR_CODES.MERCHANT_BLOCKED]: 'Merchant account is blocked',
  [ERROR_CODES.DAILY_LIMIT_EXCEEDED]: 'Daily transaction limit exceeded',
  [ERROR_CODES.MONTHLY_LIMIT_EXCEEDED]: 'Monthly transaction limit exceeded',
  [ERROR_CODES.TRANSACTION_LIMIT_EXCEEDED]: 'Transaction amount limit exceeded',

  // System
  [ERROR_CODES.INTERNAL_ERROR]: 'Internal server error',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service temporarily unavailable',
  [ERROR_CODES.GATEWAY_ERROR]: 'Payment gateway error',
  [ERROR_CODES.TIMEOUT]: 'Request timed out',
  [ERROR_CODES.IDEMPOTENCY_KEY_IN_USE]: 'Idempotency key already in use',
};
