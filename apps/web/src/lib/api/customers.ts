import apiClient from './client';
import type {
  Customer,
  CreateCustomerDto,
  PaginatedResponse,
  ListParams,
  Payment,
} from './types';

export const customersApi = {
  list: (params?: ListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<Customer>>('/customers', {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),

  get: (id: string, locale?: string) =>
    apiClient.get<Customer>(`/customers/${id}`, { locale }),

  create: (data: CreateCustomerDto, locale?: string) =>
    apiClient.post<Customer>('/customers', data, { locale }),

  update: (id: string, data: Partial<CreateCustomerDto>, locale?: string) =>
    apiClient.patch<Customer>(`/customers/${id}`, data, { locale }),

  delete: (id: string) =>
    apiClient.delete<void>(`/customers/${id}`),

  getPayments: (id: string, params?: ListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<Payment>>(`/customers/${id}/payments`, {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),
};
