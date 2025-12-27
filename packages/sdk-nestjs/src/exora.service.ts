import { Inject, Injectable } from '@nestjs/common';
import { Exora } from 'exora-sdk';

import { EXORA_CLIENT } from './constants';

/**
 * ExoraService provides access to all Exora SDK resources.
 * Inject this service to interact with the Exora API.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class PaymentsService {
 *   constructor(private readonly exora: ExoraService) {}
 *
 *   async createPayment(orderId: string, amount: number) {
 *     return this.exora.payments.create({
 *       orderId,
 *       amount,
 *       currency: 'RUB',
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class ExoraService {
  constructor(
    @Inject(EXORA_CLIENT) private readonly client: Exora,
  ) {}

  /**
   * Access payments resource
   */
  get payments() {
    return this.client.payments;
  }

  /**
   * Access refunds resource (via payments)
   */
  get refunds() {
    return this.client.payments;
  }

  /**
   * Access customers resource
   */
  get customers() {
    return this.client.customers;
  }

  /**
   * Access invoices resource
   */
  get invoices() {
    return this.client.invoices;
  }

  /**
   * Access webhooks resource
   */
  get webhooks() {
    return this.client.webhooks;
  }

  /**
   * Access API keys resource
   */
  get apiKeys() {
    return this.client.apiKeys;
  }

  /**
   * Get the underlying Exora client instance
   */
  getClient(): Exora {
    return this.client;
  }
}
