import apiClient from './client';
import type {
  Payment,
  CreatePaymentDto,
  PaginatedResponse,
  PaymentListParams,
} from './types';

export const paymentsApi = {
  list: (params?: PaymentListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<Payment>>('/payments', {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),

  get: (id: string, locale?: string) =>
    apiClient.get<Payment>(`/payments/${id}`, { locale }),

  create: (data: CreatePaymentDto, locale?: string) =>
    apiClient.post<Payment>('/payments', data, { locale }),

  capture: (id: string, amount?: number, locale?: string) =>
    apiClient.post<Payment>(`/payments/${id}/capture`, { amount }, { locale }),

  cancel: (id: string, locale?: string) =>
    apiClient.post<Payment>(`/payments/${id}/cancel`, undefined, { locale }),

  refund: (id: string, amount?: number, reason?: string, locale?: string) =>
    apiClient.post<Payment>(`/payments/${id}/refund`, { amount, reason }, { locale }),

  getStats: (fromDate?: string, toDate?: string, locale?: string) =>
    apiClient.get<{
      total: number;
      succeeded: number;
      failed: number;
      pending: number;
      totalAmount: number;
      averageAmount: number;
    }>('/payments/stats', {
      params: { fromDate, toDate },
      locale,
    }),
};
