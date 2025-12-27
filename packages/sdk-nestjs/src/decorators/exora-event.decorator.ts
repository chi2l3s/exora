import { SetMetadata } from '@nestjs/common';

import { EXORA_EVENT_HANDLER } from '../constants';

/**
 * Webhook event types
 */
export type ExoraEventType =
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
  | 'merchant.suspended'
  // Wildcard
  | '*';

/**
 * Decorator to handle specific Exora webhook events.
 *
 * @param eventType - The event type to handle (e.g., 'payment.succeeded')
 *
 * @example
 * ```typescript
 * @Controller('webhooks')
 * @ExoraWebhookHandler()
 * export class WebhooksController {
 *   @OnExoraEvent('payment.succeeded')
 *   async handlePaymentSucceeded(payment: Payment) {
 *     console.log(`Payment ${payment.id} succeeded!`);
 *   }
 *
 *   @OnExoraEvent('refund.created')
 *   async handleRefundCreated(refund: Refund) {
 *     console.log(`Refund ${refund.id} created!`);
 *   }
 *
 *   @OnExoraEvent('*')
 *   async handleAllEvents(event: ExoraWebhookEvent) {
 *     console.log(`Received event: ${event.type}`);
 *   }
 * }
 * ```
 */
export function OnExoraEvent(eventType: ExoraEventType) {
  return SetMetadata(EXORA_EVENT_HANDLER, eventType);
}
