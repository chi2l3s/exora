'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { apiKeysApi } from '@/lib/api';
import type { ListParams, CreateApiKeyDto } from '@/lib/api/types';

export const apiKeyKeys = {
  all: ['api-keys'] as const,
  lists: () => [...apiKeyKeys.all, 'list'] as const,
  list: (params?: ListParams) => [...apiKeyKeys.lists(), params] as const,
  details: () => [...apiKeyKeys.all, 'detail'] as const,
  detail: (id: string) => [...apiKeyKeys.details(), id] as const,
};

export function useApiKeys(params?: ListParams) {
  const locale = useLocale();

  return useQuery({
    queryKey: apiKeyKeys.list(params),
    queryFn: () => apiKeysApi.list(params, locale),
  });
}

export function useApiKey(id: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: apiKeyKeys.detail(id),
    queryFn: () => apiKeysApi.get(id, locale),
    enabled: !!id,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: CreateApiKeyDto) => apiKeysApi.create(data, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; isActive?: boolean };
    }) => apiKeysApi.update(id, data, locale),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiKeysApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: string) => apiKeysApi.revoke(id, locale),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() });
    },
  });
}

export function useRegenerateApiKey() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: string) => apiKeysApi.regenerate(id, locale),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: apiKeyKeys.lists() });
    },
  });
}
