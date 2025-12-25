'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { paymentsApi } from '@/lib/api';
import type { PaymentListParams, CreatePaymentDto } from '@/lib/api/types';

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params?: PaymentListParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  stats: (fromDate?: string, toDate?: string) =>
    [...paymentKeys.all, 'stats', fromDate, toDate] as const,
};

export function usePayments(params?: PaymentListParams) {
  const locale = useLocale();

  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsApi.list(params, locale),
  });
}

export function usePayment(id: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.get(id, locale),
    enabled: !!id,
  });
}

export function usePaymentStats(fromDate?: string, toDate?: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: paymentKeys.stats(fromDate, toDate),
    queryFn: () => paymentsApi.getStats(fromDate, toDate, locale),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentsApi.create(data, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}

export function useCapturePayment() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount?: number }) =>
      paymentsApi.capture(id, amount, locale),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: string) => paymentsApi.cancel(id, locale),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({
      id,
      amount,
      reason,
    }: {
      id: string;
      amount?: number;
      reason?: string;
    }) => paymentsApi.refund(id, amount, reason, locale),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
    },
  });
}
