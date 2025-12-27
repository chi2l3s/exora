import { applyDecorators, Controller, SetMetadata, UseGuards } from '@nestjs/common';

import { WEBHOOK_HANDLER } from '../constants';
import { ExoraWebhookGuard } from '../guards/webhook-signature.guard';

/**
 * Decorator to mark a controller as an Exora webhook handler.
 * Automatically applies webhook signature verification guard.
 *
 * @param path - The route path for the webhook endpoint (default: 'webhooks/exora')
 *
 * @example
 * ```typescript
 * @Controller('webhooks')
 * @ExoraWebhookHandler()
 * export class WebhooksController {
 *   @OnExoraEvent('payment.succeeded')
 *   handlePaymentSucceeded(payment: Payment) {
 *     // Handle successful payment
 *   }
 * }
 * ```
 */
export function ExoraWebhookHandler() {
  return applyDecorators(
    SetMetadata(WEBHOOK_HANDLER, true),
    UseGuards(ExoraWebhookGuard),
  );
}
