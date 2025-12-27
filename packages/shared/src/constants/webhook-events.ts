import type { WebhookEvent } from '../types';

// All Webhook Events
export const WEBHOOK_EVENTS: WebhookEvent[] = [
  // Payments
  'payment.created',
  'payment.processing',
  'payment.succeeded',
  'payment.failed',
  'payment.cancelled',
  'payment.expired',
  // Refunds
  'refund.created',
  'refund.succeeded',
  'refund.failed',
  // Subscriptions
  'subscription.created',
  'subscription.activated',
  'subscription.renewed',
  'subscription.cancelled',
  'subscription.paused',
  'subscription.resumed',
  'subscription.payment_failed',
  // Payouts
  'payout.created',
  'payout.succeeded',
  'payout.failed',
  // Merchant
  'merchant.verified',
  'merchant.suspended',
];

// Event Categories
export const WEBHOOK_EVENT_CATEGORIES = {
  payments: [
    'payment.created',
    'payment.processing',
    'payment.succeeded',
    'payment.failed',
    'payment.cancelled',
    'payment.expired',
  ] as WebhookEvent[],
  refunds: [
    'refund.created',
    'refund.succeeded',
    'refund.failed',
  ] as WebhookEvent[],
  subscriptions: [
    'subscription.created',
    'subscription.activated',
    'subscription.renewed',
    'subscription.cancelled',
    'subscription.paused',
    'subscription.resumed',
    'subscription.payment_failed',
  ] as WebhookEvent[],
  payouts: [
    'payout.created',
    'payout.succeeded',
    'payout.failed',
  ] as WebhookEvent[],
  merchant: [
    'merchant.verified',
    'merchant.suspended',
  ] as WebhookEvent[],
};

// Event Descriptions
export const WEBHOOK_EVENT_DESCRIPTIONS: Record<WebhookEvent, string> = {
  'payment.created': 'A new payment has been created',
  'payment.processing': 'Payment is being processed',
  'payment.succeeded': 'Payment has been successfully completed',
  'payment.failed': 'Payment has failed',
  'payment.cancelled': 'Payment has been cancelled',
  'payment.expired': 'Payment has expired',
  'refund.created': 'A new refund has been created',
  'refund.succeeded': 'Refund has been successfully processed',
  'refund.failed': 'Refund has failed',
  'subscription.created': 'A new subscription has been created',
  'subscription.activated': 'Subscription has been activated',
  'subscription.renewed': 'Subscription has been renewed',
  'subscription.cancelled': 'Subscription has been cancelled',
  'subscription.paused': 'Subscription has been paused',
  'subscription.resumed': 'Subscription has been resumed',
  'subscription.payment_failed': 'Subscription payment has failed',
  'payout.created': 'A new payout has been created',
  'payout.succeeded': 'Payout has been successfully processed',
  'payout.failed': 'Payout has failed',
  'merchant.verified': 'Merchant verification has been completed',
  'merchant.suspended': 'Merchant account has been suspended',
};

// Retry Intervals (in milliseconds)
export const WEBHOOK_RETRY_INTERVALS = [
  0, // Immediate
  5 * 60 * 1000, // 5 minutes
  30 * 60 * 1000, // 30 minutes
  2 * 60 * 60 * 1000, // 2 hours
  12 * 60 * 60 * 1000, // 12 hours
  24 * 60 * 60 * 1000, // 24 hours
];

export const MAX_WEBHOOK_RETRIES = 6;
