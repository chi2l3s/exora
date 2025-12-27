import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Parameter decorator to extract the raw request body.
 * Required for webhook signature verification.
 *
 * @example
 * ```typescript
 * @Post('webhook')
 * async handleWebhook(@ExoraRawBody() rawBody: Buffer) {
 *   // Raw body for signature verification
 * }
 * ```
 */
export const ExoraRawBody = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Buffer | string => {
    const request = ctx.switchToHttp().getRequest();
    // Try to get raw body from request
    return request.rawBody || request.body;
  },
);

/**
 * Parameter decorator to extract the Exora signature header.
 *
 * @example
 * ```typescript
 * @Post('webhook')
 * async handleWebhook(@ExoraSignature() signature: string) {
 *   // Signature header value
 * }
 * ```
 */
export const ExoraSignature = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['exora-signature'] || '';
  },
);
