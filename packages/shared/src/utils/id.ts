import { customAlphabet } from 'nanoid';

// Custom alphabet for IDs (no ambiguous characters)
const nanoid = customAlphabet(
  '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz',
  21
);

// Short ID for user-facing identifiers
const shortId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

/**
 * Generate a payment ID
 */
export function generatePaymentId(): string {
  return `pay_${nanoid()}`;
}

/**
 * Generate a refund ID
 */
export function generateRefundId(): string {
  return `ref_${nanoid()}`;
}

/**
 * Generate a customer ID
 */
export function generateCustomerId(): string {
  return `cus_${nanoid()}`;
}

/**
 * Generate a subscription ID
 */
export function generateSubscriptionId(): string {
  return `sub_${nanoid()}`;
}

/**
 * Generate a plan ID
 */
export function generatePlanId(): string {
  return `plan_${nanoid()}`;
}

/**
 * Generate a payout ID
 */
export function generatePayoutId(): string {
  return `po_${nanoid()}`;
}

/**
 * Generate an invoice ID
 */
export function generateInvoiceId(): string {
  return `inv_${nanoid()}`;
}

/**
 * Generate a webhook endpoint ID
 */
export function generateWebhookEndpointId(): string {
  return `we_${nanoid()}`;
}

/**
 * Generate a webhook attempt ID
 */
export function generateWebhookAttemptId(): string {
  return `wha_${nanoid()}`;
}

/**
 * Generate a project ID
 */
export function generateProjectId(): string {
  return `proj_${nanoid()}`;
}

/**
 * Generate a document ID
 */
export function generateDocumentId(): string {
  return `doc_${nanoid()}`;
}

/**
 * Generate a token ID (for payment tokens)
 */
export function generateTokenId(): string {
  return `tok_${nanoid()}`;
}

/**
 * Generate a session ID
 */
export function generateSessionId(): string {
  return `sess_${nanoid()}`;
}

/**
 * Generate a short reference code (for display)
 */
export function generateReferenceCode(): string {
  return shortId().toUpperCase();
}

/**
 * Generate an idempotency key
 */
export function generateIdempotencyKey(): string {
  return `idem_${nanoid(32)}`;
}

/**
 * Parse ID and extract prefix
 */
export function parseId(id: string): { prefix: string; value: string } | null {
  const match = id.match(/^([a-z]+)_(.+)$/);
  if (!match) {
    return null;
  }
  return {
    prefix: match[1],
    value: match[2],
  };
}

/**
 * Validate ID format
 */
export function isValidId(id: string, expectedPrefix?: string): boolean {
  const parsed = parseId(id);
  if (!parsed) {
    return false;
  }
  if (expectedPrefix && parsed.prefix !== expectedPrefix) {
    return false;
  }
  return parsed.value.length >= 10;
}
