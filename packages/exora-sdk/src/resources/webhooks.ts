import type { ExoraClient } from '../client';
import type {
  WebhookEndpoint,
  WebhookAttempt,
  CreateWebhookParams,
  UpdateWebhookParams,
  PaginationParams,
  PaginatedResponse,
  WebhookPayload,
} from '../types';
import { verifySignature, generateSignature } from '../webhooks/signature';
import { WebhookHandler, WebhookSignatureError } from '../webhooks/handler';

export class Webhooks {
  constructor(private readonly client: ExoraClient) {}

  /**
   * Create a new webhook endpoint
   */
  async createEndpoint(params: CreateWebhookParams): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'POST',
      path: '/webhooks',
      body: params,
    });
  }

  /**
   * List all webhook endpoints
   */
  async listEndpoints(): Promise<WebhookEndpoint[]> {
    return this.client.request<WebhookEndpoint[]>({
      method: 'GET',
      path: '/webhooks',
    });
  }

  /**
   * Retrieve a webhook endpoint by ID
   */
  async retrieveEndpoint(id: string): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'GET',
      path: `/webhooks/${id}`,
    });
  }

  /**
   * Update a webhook endpoint
   */
  async updateEndpoint(id: string, params: UpdateWebhookParams): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'PATCH',
      path: `/webhooks/${id}`,
      body: params,
    });
  }

  /**
   * Delete a webhook endpoint
   */
  async deleteEndpoint(id: string): Promise<{ deleted: boolean }> {
    return this.client.request<{ deleted: boolean }>({
      method: 'DELETE',
      path: `/webhooks/${id}`,
    });
  }

  /**
   * Rotate webhook secret
   */
  async rotateSecret(id: string): Promise<WebhookEndpoint> {
    return this.client.request<WebhookEndpoint>({
      method: 'POST',
      path: `/webhooks/${id}/rotate-secret`,
    });
  }

  /**
   * Test a webhook endpoint
   */
  async testEndpoint(id: string): Promise<WebhookAttempt> {
    return this.client.request<WebhookAttempt>({
      method: 'POST',
      path: `/webhooks/${id}/test`,
    });
  }

  /**
   * List webhook delivery attempts
   */
  async listAttempts(
    endpointId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<WebhookAttempt>> {
    return this.client.request<PaginatedResponse<WebhookAttempt>>({
      method: 'GET',
      path: `/webhooks/${endpointId}/attempts`,
      query: params as Record<string, unknown>,
    });
  }

  /**
   * Retry a failed webhook delivery
   */
  async retryAttempt(endpointId: string, attemptId: string): Promise<WebhookAttempt> {
    return this.client.request<WebhookAttempt>({
      method: 'POST',
      path: `/webhooks/${endpointId}/attempts/${attemptId}/retry`,
    });
  }

  // =========================================================================
  // Legacy methods (for backward compatibility)
  // =========================================================================

  async create(params: CreateWebhookParams): Promise<WebhookEndpoint> {
    return this.createEndpoint(params);
  }

  async list(): Promise<WebhookEndpoint[]> {
    return this.listEndpoints();
  }

  async retrieve(id: string): Promise<WebhookEndpoint> {
    return this.retrieveEndpoint(id);
  }

  async update(id: string, params: UpdateWebhookParams): Promise<WebhookEndpoint> {
    return this.updateEndpoint(id, params);
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    return this.deleteEndpoint(id);
  }

  // =========================================================================
  // Signature Verification (Static Methods)
  // =========================================================================

  /**
   * Construct and verify a webhook event
   */
  constructEvent<T = unknown>(
    payload: string | Buffer,
    signature: string,
    secret: string,
    options?: { tolerance?: number }
  ): WebhookPayload<T> {
    const handler = new WebhookHandler(secret);
    return handler.constructEvent<T>(payload, signature, options);
  }

  /**
   * Verify webhook signature
   */
  verifySignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
    tolerance?: number
  ): boolean {
    const result = verifySignature(payload, signature, secret, tolerance);
    return result.valid;
  }

  /**
   * Generate webhook signature (for testing)
   */
  generateSignature(
    payload: string | Buffer,
    secret: string,
    timestamp?: number
  ): string {
    return generateSignature(payload, secret, timestamp);
  }
}

export { WebhookSignatureError };
