import { ExoraClient } from '../client';
import {
  Customer,
  CreateCustomerParams,
  PaginationParams,
  PaginatedResponse,
} from '../types';

export class Customers {
  constructor(private readonly client: ExoraClient) {}

  async create(params: CreateCustomerParams): Promise<Customer> {
    return this.client.request<Customer>({
      method: 'POST',
      path: '/customers',
      body: params,
    });
  }

  async list(params?: PaginationParams): Promise<PaginatedResponse<Customer>> {
    return this.client.request<PaginatedResponse<Customer>>({
      method: 'GET',
      path: '/customers',
      query: params,
    });
  }

  async retrieve(id: string): Promise<Customer> {
    return this.client.request<Customer>({
      method: 'GET',
      path: `/customers/${id}`,
    });
  }

  async update(id: string, params: Partial<CreateCustomerParams>): Promise<Customer> {
    return this.client.request<Customer>({
      method: 'PATCH',
      path: `/customers/${id}`,
      body: params,
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.request<void>({
      method: 'DELETE',
      path: `/customers/${id}`,
    });
  }
}
