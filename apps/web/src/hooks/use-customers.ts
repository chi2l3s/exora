'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { customersApi } from '@/lib/api';
import type { ListParams, CreateCustomerDto } from '@/lib/api/types';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: ListParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  payments: (id: string, params?: ListParams) =>
    [...customerKeys.detail(id), 'payments', params] as const,
};

export function useCustomers(params?: ListParams) {
  const locale = useLocale();

  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customersApi.list(params, locale),
  });
}

export function useCustomer(id: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customersApi.get(id, locale),
    enabled: !!id,
  });
}

export function useCustomerPayments(id: string, params?: ListParams) {
  const locale = useLocale();

  return useQuery({
    queryKey: customerKeys.payments(id, params),
    queryFn: () => customersApi.getPayments(id, params, locale),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customersApi.create(data, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCustomerDto> }) =>
      customersApi.update(id, data, locale),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}
