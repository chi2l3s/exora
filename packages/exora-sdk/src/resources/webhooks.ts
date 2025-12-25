import { ExoraClient } from '../client';
import { WebhookEndpoint, CreateWebhookParams } from '../types';

export class Webhooks {
  constructor(private readonly client: ExoraClient) {}

  async create(params: CreateWebhookParams): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'POST',
      path: '/webhooks',
      body: params,
    });
  }

  async list(): Promise<WebhookEndpoint[]> {
    return this.client.request<WebhookEndpoint[]>({
      method: 'GET',
      path: '/webhooks',
    });
  }

  async retrieve(id: string): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'GET',
      path: `/webhooks/${id}`,
    });
  }

  async update(
    id: string,
    params: Partial<CreateWebhookParams> & { isActive?: boolean },
  ): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'PATCH',
      path: `/webhooks/${id}`,
      body: params,
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.request<void>({
      method: 'DELETE',
      path: `/webhooks/${id}`,
    });
  }
}
