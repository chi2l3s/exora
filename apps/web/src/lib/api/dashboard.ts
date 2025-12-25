import apiClient from './client';
import type { DashboardStats, RevenueChartData, PaymentMethodStats, Payment } from './types';

export interface DashboardOverview {
  stats: DashboardStats;
  recentPayments: Payment[];
  revenueChart: RevenueChartData[];
  paymentMethods: PaymentMethodStats[];
}

export const dashboardApi = {
  getOverview: (locale?: string) =>
    apiClient.get<DashboardOverview>('/dashboard/overview', { locale }),

  getStats: (fromDate?: string, toDate?: string, locale?: string) =>
    apiClient.get<DashboardStats>('/dashboard/stats', {
      params: { fromDate, toDate },
      locale,
    }),

  getRevenueChart: (
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    locale?: string
  ) =>
    apiClient.get<RevenueChartData[]>('/dashboard/revenue-chart', {
      params: { period },
      locale,
    }),

  getPaymentMethodStats: (locale?: string) =>
    apiClient.get<PaymentMethodStats[]>('/dashboard/payment-methods', { locale }),

  getRecentPayments: (limit: number = 10, locale?: string) =>
    apiClient.get<Payment[]>('/dashboard/recent-payments', {
      params: { limit },
      locale,
    }),

  exportData: async (
    type: 'payments' | 'invoices' | 'customers',
    format: 'csv' | 'xlsx',
    params?: { fromDate?: string; toDate?: string }
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/export/${type}?format=${format}${
        params?.fromDate ? `&fromDate=${params.fromDate}` : ''
      }${params?.toDate ? `&toDate=${params.toDate}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-export.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
