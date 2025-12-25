'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { dashboardApi } from '@/lib/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
  stats: (fromDate?: string, toDate?: string) =>
    [...dashboardKeys.all, 'stats', fromDate, toDate] as const,
  revenueChart: (period: string) =>
    [...dashboardKeys.all, 'revenue-chart', period] as const,
  paymentMethods: () => [...dashboardKeys.all, 'payment-methods'] as const,
  recentPayments: (limit: number) =>
    [...dashboardKeys.all, 'recent-payments', limit] as const,
};

export function useDashboardOverview() {
  const locale = useLocale();

  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => dashboardApi.getOverview(locale),
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useDashboardStats(fromDate?: string, toDate?: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: dashboardKeys.stats(fromDate, toDate),
    queryFn: () => dashboardApi.getStats(fromDate, toDate, locale),
    staleTime: 30 * 1000,
  });
}

export function useRevenueChart(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  const locale = useLocale();

  return useQuery({
    queryKey: dashboardKeys.revenueChart(period),
    queryFn: () => dashboardApi.getRevenueChart(period, locale),
    staleTime: 60 * 1000,
  });
}

export function usePaymentMethodStats() {
  const locale = useLocale();

  return useQuery({
    queryKey: dashboardKeys.paymentMethods(),
    queryFn: () => dashboardApi.getPaymentMethodStats(locale),
    staleTime: 60 * 1000,
  });
}

export function useRecentPayments(limit: number = 10) {
  const locale = useLocale();

  return useQuery({
    queryKey: dashboardKeys.recentPayments(limit),
    queryFn: () => dashboardApi.getRecentPayments(limit, locale),
    staleTime: 30 * 1000,
  });
}
