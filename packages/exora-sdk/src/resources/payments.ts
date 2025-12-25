import { ExoraClient } from '../client';
import {
  Payment,
  CreatePaymentParams,
  PaginationParams,
  PaginatedResponse,
} from '../types';

export class Payments {
  constructor(private readonly client: ExoraClient) {}

  async create(params: CreatePaymentParams): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: '/payments',
      body: params,
    });
  }

  async list(params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<Payment>> {
    return this.client.request<PaginatedResponse<Payment>>({
      method: 'GET',
      path: '/payments',
      query: params,
    });
  }

  async retrieve(id: string): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'GET',
      path: `/payments/${id}`,
    });
  }

  async confirm(id: string): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: `/payments/${id}/confirm`,
    });
  }

  async cancel(id: string): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: `/payments/${id}/cancel`,
    });
  }

  async refund(id: string, amount?: number): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: `/payments/${id}/refund`,
      body: amount ? { amount } : undefined,
    });
  }
}
