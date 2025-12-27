import type { WebhookPayload, WebhookEvent } from '../types';
import { verifySignature } from './signature';

export interface ConstructEventOptions {
  tolerance?: number;
}

/**
 * Webhook handler utilities
 */
export class WebhookHandler {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Construct and verify a webhook event from raw payload and signature
   */
  constructEvent<T = unknown>(
    payload: string | Buffer,
    signature: string,
    options: ConstructEventOptions = {}
  ): WebhookPayload<T> {
    const { tolerance = 300000 } = options;

    const result = verifySignature(payload, signature, this.secret, tolerance);

    if (!result.valid) {
      throw new WebhookSignatureError(result.error || 'Invalid signature');
    }

    const payloadString = typeof payload === 'string' ? payload : payload.toString();

    try {
      return JSON.parse(payloadString) as WebhookPayload<T>;
    } catch {
      throw new WebhookSignatureError('Invalid webhook payload');
    }
  }

  /**
   * Verify webhook signature without parsing
   */
  verifySignature(
    payload: string | Buffer,
    signature: string,
    options: ConstructEventOptions = {}
  ): boolean {
    const { tolerance = 300000 } = options;
    const result = verifySignature(payload, signature, this.secret, tolerance);
    return result.valid;
  }
}

/**
 * Error thrown when webhook signature verification fails
 */
export class WebhookSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebhookSignatureError';
  }
}

/**
 * Create a webhook handler instance
 */
export function createWebhookHandler(secret: string): WebhookHandler {
  return new WebhookHandler(secret);
}
