import { ExoraClient } from '../client';
import { ApiKey, CreateApiKeyParams } from '../types';

export class ApiKeys {
  constructor(private readonly client: ExoraClient) {}

  async create(params: CreateApiKeyParams): Promise<ApiKey> {
    return this.client.request<ApiKey>({
      method: 'POST',
      path: '/api-keys',
      body: params,
    });
  }

  async list(): Promise<ApiKey[]> {
    return this.client.request<ApiKey[]>({
      method: 'GET',
      path: '/api-keys',
    });
  }

  async retrieve(id: string): Promise<ApiKey> {
    return this.client.request<ApiKey>({
      method: 'GET',
      path: `/api-keys/${id}`,
    });
  }

  async revoke(id: string): Promise<ApiKey> {
    return this.client.request<ApiKey>({
      method: 'DELETE',
      path: `/api-keys/${id}`,
    });
  }

  async rotate(id: string): Promise<ApiKey> {
    return this.client.request<ApiKey>({
      method: 'POST',
      path: `/api-keys/${id}/rotate`,
    });
  }
}
