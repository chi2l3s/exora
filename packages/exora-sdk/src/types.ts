export type Locale = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko';

export interface ExoraOptions {
  apiKey: string;
  baseUrl?: string;
  locale?: Locale;
  timeout?: number;
  maxRetries?: number;
}

export interface ExoraModuleOptions extends ExoraOptions {
  isGlobal?: boolean;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// ============================================================================
// Payment Types
// ============================================================================

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'REQUIRES_ACTION'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'EXPIRED';

export type PaymentMethod =
  | 'CARD'
  | 'SBP'
  | 'QIWI'
  | 'YOOMONEY'
  | 'BANK_TRANSFER'
  | 'CRYPTO'
  | 'WALLET';

export interface Payment {
  id: string;
  merchantId: string;
  projectId?: string;
  orderId: string;
  externalId?: string;
  amount: number;
  currency: string;
  amountRefunded: number;
  feeAmount: number;
  netAmount: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  description?: string;
  metadata: Record<string, unknown>;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  customerId?: string;
  cardBrand?: string;
  cardLast4?: string;
  failureCode?: string;
  failureMessage?: string;
  returnUrl?: string;
  cancelUrl?: string;
  paymentUrl?: string;
  paidAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  description?: string;
  metadata?: Record<string, unknown>;
  customer?: {
    email?: string;
    phone?: string;
    name?: string;
    id?: string;
  };
  returnUrl?: string;
  cancelUrl?: string;
  paymentMethod?: PaymentMethod;
  capture?: boolean;
  expiresIn?: number;
}

export interface CreatePaymentResponse {
  payment: Payment;
  paymentUrl: string;
  clientSecret?: string;
}

export interface CapturePaymentParams {
  amount?: number;
}

export interface CancelPaymentParams {
  reason?: string;
}

export interface PaymentFilters extends PaginationParams {
  status?: PaymentStatus | PaymentStatus[];
  paymentMethod?: PaymentMethod | PaymentMethod[];
  customerId?: string;
  orderId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// Refund Types
// ============================================================================

export type RefundStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';

export type RefundReason =
  | 'REQUESTED_BY_CUSTOMER'
  | 'DUPLICATE'
  | 'FRAUDULENT'
  | 'ORDER_CANCELLED'
  | 'OTHER';

export interface Refund {
  id: string;
  merchantId: string;
  transactionId: string;
  amount: number;
  reason?: string;
  description?: string;
  status: RefundStatus;
  failureCode?: string;
  failureMessage?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefundParams {
  paymentId: string;
  amount?: number;
  reason?: RefundReason;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface RefundFilters extends PaginationParams {
  paymentId?: string;
  status?: RefundStatus | RefundStatus[];
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Subscription Types
// ============================================================================

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'UNPAID'
  | 'PAUSED'
  | 'TRIALING';

export type SubscriptionInterval = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface SubscriptionPlan {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number;
  trialDays: number;
  isActive: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  merchantId: string;
  customerId: string;
  customerEmail: string;
  planId?: string;
  plan?: SubscriptionPlan;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string;
  endedAt?: string;
  trialStart?: string;
  trialEnd?: string;
  paymentTokenId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionParams {
  customerId: string;
  planId?: string;
  amount?: number;
  currency?: string;
  interval?: SubscriptionInterval;
  intervalCount?: number;
  trialDays?: number;
  paymentTokenId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionParams {
  planId?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}

export interface CancelSubscriptionParams {
  cancelAtPeriodEnd?: boolean;
}

export interface CreatePlanParams {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount?: number;
  trialDays?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdatePlanParams {
  name?: string;
  description?: string;
  isActive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionFilters extends PaginationParams {
  status?: SubscriptionStatus | SubscriptionStatus[];
  customerId?: string;
  planId?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface Customer {
  id: string;
  merchantId: string;
  email: string;
  phone?: string;
  name?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerParams {
  email: string;
  phone?: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateCustomerParams {
  email?: string;
  phone?: string;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface CustomerFilters extends PaginationParams {
  email?: string;
  phone?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Payout Types
// ============================================================================

export type PayoutStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

export interface Payout {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  feeAmount: number;
  netAmount: number;
  status: PayoutStatus;
  bankAccount?: string;
  bankName?: string;
  bik?: string;
  failureCode?: string;
  failureMessage?: string;
  description?: string;
  metadata: Record<string, unknown>;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePayoutParams {
  amount: number;
  currency: string;
  bankAccount: string;
  bankName?: string;
  bik: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface PayoutFilters extends PaginationParams {
  status?: PayoutStatus | PayoutStatus[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// ============================================================================
// Balance Types
// ============================================================================

export interface Balance {
  id: string;
  merchantId: string;
  currency: string;
  available: number;
  pending: number;
  reserved: number;
  updatedAt: string;
}

// ============================================================================
// Invoice Types
// ============================================================================

export type InvoiceStatus = 'DRAFT' | 'OPEN' | 'PAID' | 'VOID' | 'UNCOLLECTIBLE';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  merchantId: string;
  customerId?: string;
  number: string;
  status: InvoiceStatus;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  dueDate?: string;
  paidAt?: string;
  metadata: Record<string, unknown>;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceParams {
  customerId?: string;
  customerEmail?: string;
  currency?: string;
  dueDate?: string;
  items: Omit<InvoiceItem, 'id' | 'amount'>[];
  metadata?: Record<string, unknown>;
}

export interface UpdateInvoiceParams {
  dueDate?: string;
  items?: Omit<InvoiceItem, 'id' | 'amount'>[];
  metadata?: Record<string, unknown>;
}

export interface InvoiceFilters extends PaginationParams {
  status?: InvoiceStatus | InvoiceStatus[];
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================================================
// Webhook Types
// ============================================================================

export type WebhookEvent =
  | 'payment.created'
  | 'payment.processing'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.cancelled'
  | 'payment.expired'
  | 'refund.created'
  | 'refund.succeeded'
  | 'refund.failed'
  | 'subscription.created'
  | 'subscription.activated'
  | 'subscription.renewed'
  | 'subscription.cancelled'
  | 'subscription.paused'
  | 'subscription.resumed'
  | 'subscription.payment_failed'
  | 'payout.created'
  | 'payout.succeeded'
  | 'payout.failed'
  | 'merchant.verified'
  | 'merchant.suspended';

export interface WebhookEndpoint {
  id: string;
  merchantId: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  isActive: boolean;
  successCount: number;
  failureCount: number;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookAttempt {
  id: string;
  endpointId: string;
  transactionId?: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING';
  statusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  attemptNumber: number;
  nextRetryAt?: string;
  createdAt: string;
}

export interface CreateWebhookParams {
  url: string;
  events: WebhookEvent[];
  description?: string;
}

export interface UpdateWebhookParams {
  url?: string;
  events?: WebhookEvent[];
  isActive?: boolean;
}

export interface WebhookPayload<T = unknown> {
  id: string;
  type: WebhookEvent;
  data: T;
  createdAt: string;
  livemode: boolean;
}

// ============================================================================
// API Key Types
// ============================================================================

export type ApiKeyType = 'LIVE' | 'TEST';

export interface ApiKey {
  id: string;
  merchantId: string;
  projectId?: string;
  name: string;
  keyPrefix: string;
  type: ApiKeyType;
  permissions: string[];
  ipWhitelist: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyParams {
  name: string;
  type: ApiKeyType;
  projectId?: string;
  permissions?: string[];
  ipWhitelist?: string[];
  rateLimit?: number;
  expiresAt?: string;
}

export interface CreateApiKeyResponse {
  apiKey: ApiKey;
  key: string; // Full key - only shown at creation
}

export interface UpdateApiKeyParams {
  name?: string;
  permissions?: string[];
  ipWhitelist?: string[];
  rateLimit?: number;
  isActive?: boolean;
  expiresAt?: string;
}
