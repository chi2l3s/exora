import type { ExoraClient } from '../client';
import type {
  Refund,
  CreateRefundParams,
  RefundFilters,
  PaginatedResponse,
} from '../types';

export class Refunds {
  constructor(private readonly client: ExoraClient) {}

  /**
   * Create a new refund
   */
  async create(params: CreateRefundParams): Promise<Refund> {
    return this.client.request<Refund>({
      method: 'POST',
      path: '/refunds',
      body: params,
    });
  }

  /**
   * List all refunds
   */
  async list(params?: RefundFilters): Promise<PaginatedResponse<Refund>> {
    return this.client.request<PaginatedResponse<Refund>>({
      method: 'GET',
      path: '/refunds',
      query: params as Record<string, unknown>,
    });
  }

  /**
   * Retrieve a refund by ID
   */
  async retrieve(id: string): Promise<Refund> {
    return this.client.request<Refund>({
      method: 'GET',
      path: `/refunds/${id}`,
    });
  }
}
