import type { ExoraClient } from '../client';
import type { Balance } from '../types';

export class Balances {
  constructor(private readonly client: ExoraClient) {}

  /**
   * List all balances for the merchant
   */
  async list(): Promise<Balance[]> {
    return this.client.request<Balance[]>({
      method: 'GET',
      path: '/balances',
    });
  }

  /**
   * Get balance for a specific currency
   */
  async retrieve(currency: string): Promise<Balance> {
    return this.client.request<Balance>({
      method: 'GET',
      path: `/balances/${currency}`,
    });
  }
}
