'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { webhooksApi } from '@/lib/api';
import type { ListParams, CreateWebhookDto } from '@/lib/api/types';

export const webhookKeys = {
  all: ['webhooks'] as const,
  lists: () => [...webhookKeys.all, 'list'] as const,
  list: (params?: ListParams) => [...webhookKeys.lists(), params] as const,
  details: () => [...webhookKeys.all, 'detail'] as const,
  detail: (id: string) => [...webhookKeys.details(), id] as const,
  deliveries: (endpointId: string, params?: ListParams) =>
    [...webhookKeys.detail(endpointId), 'deliveries', params] as const,
  events: () => [...webhookKeys.all, 'events'] as const,
};

export function useWebhooks(params?: ListParams) {
  const locale = useLocale();

  return useQuery({
    queryKey: webhookKeys.list(params),
    queryFn: () => webhooksApi.list(params, locale),
  });
}

export function useWebhook(id: string) {
  const locale = useLocale();

  return useQuery({
    queryKey: webhookKeys.detail(id),
    queryFn: () => webhooksApi.get(id, locale),
    enabled: !!id,
  });
}

export function useWebhookDeliveries(endpointId: string, params?: ListParams) {
  const locale = useLocale();

  return useQuery({
    queryKey: webhookKeys.deliveries(endpointId, params),
    queryFn: () => webhooksApi.getDeliveries(endpointId, params, locale),
    enabled: !!endpointId,
  });
}

export function useAvailableWebhookEvents() {
  return useQuery({
    queryKey: webhookKeys.events(),
    queryFn: () => webhooksApi.getAvailableEvents(),
    staleTime: Infinity, // Events don't change often
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: CreateWebhookDto) => webhooksApi.create(data, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWebhookDto> }) =>
      webhooksApi.update(id, data, locale),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => webhooksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
}

export function useEnableWebhook() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: string) => webhooksApi.enable(id, locale),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
}

export function useDisableWebhook() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: string) => webhooksApi.disable(id, locale),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: webhookKeys.lists() });
    },
  });
}

export function useRotateWebhookSecret() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: string) => webhooksApi.rotateSecret(id, locale),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.detail(id) });
    },
  });
}

export function useTestWebhook() {
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, eventType }: { id: string; eventType: string }) =>
      webhooksApi.test(id, eventType, locale),
  });
}

export function useRetryWebhookDelivery() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({
      endpointId,
      deliveryId,
    }: {
      endpointId: string;
      deliveryId: string;
    }) => webhooksApi.retryDelivery(endpointId, deliveryId, locale),
    onSuccess: (_, { endpointId }) => {
      queryClient.invalidateQueries({ queryKey: webhookKeys.deliveries(endpointId) });
    },
  });
}
