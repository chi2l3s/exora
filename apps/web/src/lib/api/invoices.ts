import apiClient from './client';
import type {
  Invoice,
  CreateInvoiceDto,
  PaginatedResponse,
  InvoiceListParams,
} from './types';

export const invoicesApi = {
  list: (params?: InvoiceListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<Invoice>>('/invoices', {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),

  get: (id: string, locale?: string) =>
    apiClient.get<Invoice>(`/invoices/${id}`, { locale }),

  create: (data: CreateInvoiceDto, locale?: string) =>
    apiClient.post<Invoice>('/invoices', data, { locale }),

  update: (id: string, data: Partial<CreateInvoiceDto>, locale?: string) =>
    apiClient.patch<Invoice>(`/invoices/${id}`, data, { locale }),

  delete: (id: string) =>
    apiClient.delete<void>(`/invoices/${id}`),

  finalize: (id: string, locale?: string) =>
    apiClient.post<Invoice>(`/invoices/${id}/finalize`, undefined, { locale }),

  markAsPaid: (id: string, locale?: string) =>
    apiClient.post<Invoice>(`/invoices/${id}/pay`, undefined, { locale }),

  void: (id: string, locale?: string) =>
    apiClient.post<Invoice>(`/invoices/${id}/void`, undefined, { locale }),

  sendReminder: (id: string, locale?: string) =>
    apiClient.post<void>(`/invoices/${id}/send-reminder`, undefined, { locale }),

  downloadPdf: async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
