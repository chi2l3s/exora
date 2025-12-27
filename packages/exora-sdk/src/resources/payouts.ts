import type { ExoraClient } from '../client';
import type {
  Payout,
  CreatePayoutParams,
  PayoutFilters,
  PaginatedResponse,
} from '../types';

export class Payouts {
  constructor(private readonly client: ExoraClient) {}

  /**
   * Create a new payout
   */
  async create(params: CreatePayoutParams): Promise<Payout> {
    return this.client.request<Payout>({
      method: 'POST',
      path: '/payouts',
      body: params,
    });
  }

  /**
   * List all payouts
   */
  async list(params?: PayoutFilters): Promise<PaginatedResponse<Payout>> {
    return this.client.request<PaginatedResponse<Payout>>({
      method: 'GET',
      path: '/payouts',
      query: params as Record<string, unknown>,
    });
  }

  /**
   * Retrieve a payout by ID
   */
  async retrieve(id: string): Promise<Payout> {
    return this.client.request<Payout>({
      method: 'GET',
      path: `/payouts/${id}`,
    });
  }

  /**
   * Cancel a pending payout
   */
  async cancel(id: string): Promise<Payout> {
    return this.client.request<Payout>({
      method: 'POST',
      path: `/payouts/${id}/cancel`,
    });
  }
}
