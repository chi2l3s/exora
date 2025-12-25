import apiClient from './client';
import type {
  WebhookEndpoint,
  WebhookDelivery,
  CreateWebhookDto,
  PaginatedResponse,
  ListParams,
} from './types';

export const webhooksApi = {
  // Endpoints
  list: (params?: ListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<WebhookEndpoint>>('/webhooks', {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),

  get: (id: string, locale?: string) =>
    apiClient.get<WebhookEndpoint>(`/webhooks/${id}`, { locale }),

  create: (data: CreateWebhookDto, locale?: string) =>
    apiClient.post<WebhookEndpoint>('/webhooks', data, { locale }),

  update: (id: string, data: Partial<CreateWebhookDto>, locale?: string) =>
    apiClient.patch<WebhookEndpoint>(`/webhooks/${id}`, data, { locale }),

  delete: (id: string) =>
    apiClient.delete<void>(`/webhooks/${id}`),

  enable: (id: string, locale?: string) =>
    apiClient.post<WebhookEndpoint>(`/webhooks/${id}/enable`, undefined, { locale }),

  disable: (id: string, locale?: string) =>
    apiClient.post<WebhookEndpoint>(`/webhooks/${id}/disable`, undefined, { locale }),

  rotateSecret: (id: string, locale?: string) =>
    apiClient.post<{ secret: string }>(`/webhooks/${id}/rotate-secret`, undefined, { locale }),

  test: (id: string, eventType: string, locale?: string) =>
    apiClient.post<WebhookDelivery>(`/webhooks/${id}/test`, { eventType }, { locale }),

  // Deliveries
  getDeliveries: (endpointId: string, params?: ListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<WebhookDelivery>>(`/webhooks/${endpointId}/deliveries`, {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),

  retryDelivery: (endpointId: string, deliveryId: string, locale?: string) =>
    apiClient.post<WebhookDelivery>(
      `/webhooks/${endpointId}/deliveries/${deliveryId}/retry`,
      undefined,
      { locale }
    ),

  // Available events
  getAvailableEvents: () =>
    apiClient.get<{ events: string[] }>('/webhooks/events'),
};
