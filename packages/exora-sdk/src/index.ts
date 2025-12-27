// Client
export { ExoraClient, Exora } from './client';

// Errors
export {
  ExoraError,
  AuthenticationError,
  InvalidRequestError,
  NotFoundError,
  RateLimitError,
} from './errors';

// Resources
export {
  Payments,
  Invoices,
  Customers,
  Webhooks,
  WebhookSignatureError,
  ApiKeys,
  Refunds,
  Subscriptions,
  Payouts,
  Balances,
} from './resources';

// Webhook utilities
export {
  generateSignature,
  verifySignature,
  parseSignature,
  WebhookHandler,
  createWebhookHandler,
} from './webhooks';

// Types
export type {
  // Core types
  Locale,
  ExoraOptions,
  ExoraModuleOptions,
  RequestOptions,
  PaginationParams,
  PaginatedResponse,
  // Payment types
  Payment,
  PaymentStatus,
  PaymentMethod,
  CreatePaymentParams,
  CreatePaymentResponse,
  CapturePaymentParams,
  CancelPaymentParams,
  PaymentFilters,
  // Refund types
  Refund,
  RefundStatus,
  RefundReason,
  CreateRefundParams,
  RefundFilters,
  // Subscription types
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionInterval,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  CancelSubscriptionParams,
  CreatePlanParams,
  UpdatePlanParams,
  SubscriptionFilters,
  // Customer types
  Customer,
  CreateCustomerParams,
  UpdateCustomerParams,
  CustomerFilters,
  // Payout types
  Payout,
  PayoutStatus,
  CreatePayoutParams,
  PayoutFilters,
  // Balance types
  Balance,
  // Invoice types
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  CreateInvoiceParams,
  UpdateInvoiceParams,
  InvoiceFilters,
  // Webhook types
  WebhookEndpoint,
  WebhookAttempt,
  WebhookEvent,
  WebhookPayload,
  CreateWebhookParams,
  UpdateWebhookParams,
  // API Key types
  ApiKey,
  ApiKeyType,
  CreateApiKeyParams,
  CreateApiKeyResponse,
  UpdateApiKeyParams,
} from './types';

// NestJS module (for convenience)
export { ExoraModule, EXORA_OPTIONS } from './nestjs/exora.module';
