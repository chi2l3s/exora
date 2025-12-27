import type { Payment } from './payment.types';
import type { Refund } from './refund.types';
import type { Subscription } from './subscription.types';
import type { Payout } from './payout.types';

// Webhook Events
export type WebhookEvent =
  // Payments
  | 'payment.created'
  | 'payment.processing'
  | 'payment.succeeded'
  | 'payment.failed'
  | 'payment.cancelled'
  | 'payment.expired'
  // Refunds
  | 'refund.created'
  | 'refund.succeeded'
  | 'refund.failed'
  // Subscriptions
  | 'subscription.created'
  | 'subscription.activated'
  | 'subscription.renewed'
  | 'subscription.cancelled'
  | 'subscription.paused'
  | 'subscription.resumed'
  | 'subscription.payment_failed'
  // Payouts
  | 'payout.created'
  | 'payout.succeeded'
  | 'payout.failed'
  // Merchant
  | 'merchant.verified'
  | 'merchant.suspended';

// Webhook Delivery Status
export type WebhookDeliveryStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING';

// Webhook Endpoint Object
export interface WebhookEndpoint {
  id: string;
  merchantId: string;
  url: string;
  secret: string;
  events: WebhookEvent[];
  isActive: boolean;
  successCount: number;
  failureCount: number;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Webhook Attempt Object
export interface WebhookAttempt {
  id: string;
  endpointId: string;
  transactionId?: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  status: WebhookDeliveryStatus;
  statusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  attemptNumber: number;
  nextRetryAt?: Date;
  createdAt: Date;
}

// Create Webhook Endpoint Input
export interface CreateWebhookEndpointInput {
  url: string;
  events: WebhookEvent[];
  description?: string;
}

// Update Webhook Endpoint Input
export interface UpdateWebhookEndpointInput {
  url?: string;
  events?: WebhookEvent[];
  isActive?: boolean;
}

// Webhook Payload
export interface WebhookPayload<T = unknown> {
  id: string;
  type: WebhookEvent;
  data: T;
  createdAt: Date;
  livemode: boolean;
}

// Typed Webhook Payloads
export type PaymentWebhookPayload = WebhookPayload<Payment>;
export type RefundWebhookPayload = WebhookPayload<Refund>;
export type SubscriptionWebhookPayload = WebhookPayload<Subscription>;
export type PayoutWebhookPayload = WebhookPayload<Payout>;
