import { ExoraClient } from '../client';
import {
  Invoice,
  CreateInvoiceParams,
  PaginationParams,
  PaginatedResponse,
} from '../types';

export class Invoices {
  constructor(private readonly client: ExoraClient) {}

  async create(params: CreateInvoiceParams): Promise<Invoice> {
    return this.client.request<Invoice>({
      method: 'POST',
      path: '/invoices',
      body: params,
    });
  }

  async list(params?: PaginationParams & { status?: string }): Promise<PaginatedResponse<Invoice>> {
    return this.client.request<PaginatedResponse<Invoice>>({
      method: 'GET',
      path: '/invoices',
      query: params,
    });
  }

  async retrieve(id: string): Promise<Invoice> {
    return this.client.request<Invoice>({
      method: 'GET',
      path: `/invoices/${id}`,
    });
  }

  async update(id: string, params: Partial<CreateInvoiceParams>): Promise<Invoice> {
    return this.client.request<Invoice>({
      method: 'PATCH',
      path: `/invoices/${id}`,
      body: params,
    });
  }

  async send(id: string): Promise<Invoice> {
    return this.client.request<Invoice>({
      method: 'POST',
      path: `/invoices/${id}/send`,
    });
  }

  async markAsPaid(id: string): Promise<Invoice> {
    return this.client.request<Invoice>({
      method: 'POST',
      path: `/invoices/${id}/pay`,
    });
  }

  async void(id: string): Promise<Invoice> {
    return this.client.request<Invoice>({
      method: 'POST',
      path: `/invoices/${id}/void`,
    });
  }
}
