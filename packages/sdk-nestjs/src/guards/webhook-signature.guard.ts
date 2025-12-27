import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { EXORA_OPTIONS } from '../constants';
import type { ExoraModuleOptions } from '../interfaces';

/**
 * Guard that verifies Exora webhook signatures.
 * Automatically applied when using @ExoraWebhookHandler() decorator.
 */
@Injectable()
export class ExoraWebhookGuard implements CanActivate {
  constructor(
    @Inject(EXORA_OPTIONS) private readonly options: ExoraModuleOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['exora-signature'];

    if (!signature) {
      throw new UnauthorizedException('Missing Exora-Signature header');
    }

    if (!this.options.webhookSecret) {
      throw new UnauthorizedException('Webhook secret not configured');
    }

    const rawBody = request.rawBody || JSON.stringify(request.body);
    const isValid = this.verifySignature(
      rawBody,
      signature,
      this.options.webhookSecret,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    return true;
  }

  private verifySignature(
    payload: string | Buffer,
    header: string,
    secret: string,
  ): boolean {
    try {
      const parsed = this.parseSignature(header);
      if (!parsed) {
        return false;
      }

      const { timestamp, signatures } = parsed;

      // Check timestamp tolerance (5 minutes)
      const now = Date.now();
      if (Math.abs(now - timestamp) > 300000) {
        return false;
      }

      // Generate expected signature
      const signedPayload = `${timestamp}.${typeof payload === 'string' ? payload : payload.toString()}`;
      const expectedSignature = createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

      // Compare signatures
      for (const sig of signatures) {
        try {
          const sigBuffer = Buffer.from(sig, 'hex');
          const expectedBuffer = Buffer.from(expectedSignature, 'hex');

          if (
            sigBuffer.length === expectedBuffer.length &&
            timingSafeEqual(sigBuffer, expectedBuffer)
          ) {
            return true;
          }
        } catch {
          continue;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  private parseSignature(header: string): { timestamp: number; signatures: string[] } | null {
    try {
      const parts = header.split(',');
      let timestamp = 0;
      const signatures: string[] = [];

      for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === 't') {
          timestamp = parseInt(value, 10);
        } else if (key.startsWith('v')) {
          signatures.push(value);
        }
      }

      if (timestamp === 0 || signatures.length === 0) {
        return null;
      }

      return { timestamp, signatures };
    } catch {
      return null;
    }
  }
}
