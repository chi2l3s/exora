import apiClient from './client';
import type { ApiKey, ApiKeyWithSecret, CreateApiKeyDto, PaginatedResponse, ListParams } from './types';

export const apiKeysApi = {
  list: (params?: ListParams, locale?: string) =>
    apiClient.get<PaginatedResponse<ApiKey>>('/api-keys', {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),

  get: (id: string, locale?: string) =>
    apiClient.get<ApiKey>(`/api-keys/${id}`, { locale }),

  create: (data: CreateApiKeyDto, locale?: string) =>
    apiClient.post<ApiKeyWithSecret>('/api-keys', data, { locale }),

  update: (id: string, data: { name?: string; isActive?: boolean }, locale?: string) =>
    apiClient.patch<ApiKey>(`/api-keys/${id}`, data, { locale }),

  delete: (id: string) =>
    apiClient.delete<void>(`/api-keys/${id}`),

  revoke: (id: string, locale?: string) =>
    apiClient.post<ApiKey>(`/api-keys/${id}/revoke`, undefined, { locale }),

  regenerate: (id: string, locale?: string) =>
    apiClient.post<ApiKeyWithSecret>(`/api-keys/${id}/regenerate`, undefined, { locale }),
};
