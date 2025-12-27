import type { ExoraClient } from '../client';
import type {
  Subscription,
  SubscriptionPlan,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  CancelSubscriptionParams,
  CreatePlanParams,
  UpdatePlanParams,
  SubscriptionFilters,
  PaginatedResponse,
  PaginationParams,
} from '../types';

export class Subscriptions {
  constructor(private readonly client: ExoraClient) {}

  // =========================================================================
  // Subscriptions
  // =========================================================================

  /**
   * Create a new subscription
   */
  async create(params: CreateSubscriptionParams): Promise<Subscription> {
    return this.client.request<Subscription>({
      method: 'POST',
      path: '/subscriptions',
      body: params,
    });
  }

  /**
   * List all subscriptions
   */
  async list(params?: SubscriptionFilters): Promise<PaginatedResponse<Subscription>> {
    return this.client.request<PaginatedResponse<Subscription>>({
      method: 'GET',
      path: '/subscriptions',
      query: params as Record<string, unknown>,
    });
  }

  /**
   * Retrieve a subscription by ID
   */
  async retrieve(id: string): Promise<Subscription> {
    return this.client.request<Subscription>({
      method: 'GET',
      path: `/subscriptions/${id}`,
    });
  }

  /**
   * Update a subscription
   */
  async update(id: string, params: UpdateSubscriptionParams): Promise<Subscription> {
    return this.client.request<Subscription>({
      method: 'PATCH',
      path: `/subscriptions/${id}`,
      body: params,
    });
  }

  /**
   * Cancel a subscription
   */
  async cancel(id: string, params?: CancelSubscriptionParams): Promise<Subscription> {
    return this.client.request<Subscription>({
      method: 'POST',
      path: `/subscriptions/${id}/cancel`,
      body: params,
    });
  }

  /**
   * Pause a subscription
   */
  async pause(id: string): Promise<Subscription> {
    return this.client.request<Subscription>({
      method: 'POST',
      path: `/subscriptions/${id}/pause`,
    });
  }

  /**
   * Resume a paused subscription
   */
  async resume(id: string): Promise<Subscription> {
    return this.client.request<Subscription>({
      method: 'POST',
      path: `/subscriptions/${id}/resume`,
    });
  }

  // =========================================================================
  // Subscription Plans
  // =========================================================================

  /**
   * Create a new subscription plan
   */
  async createPlan(params: CreatePlanParams): Promise<SubscriptionPlan> {
    return this.client.request<SubscriptionPlan>({
      method: 'POST',
      path: '/subscription-plans',
      body: params,
    });
  }

  /**
   * List all subscription plans
   */
  async listPlans(params?: PaginationParams): Promise<PaginatedResponse<SubscriptionPlan>> {
    return this.client.request<PaginatedResponse<SubscriptionPlan>>({
      method: 'GET',
      path: '/subscription-plans',
      query: params as Record<string, unknown>,
    });
  }

  /**
   * Retrieve a subscription plan by ID
   */
  async retrievePlan(id: string): Promise<SubscriptionPlan> {
    return this.client.request<SubscriptionPlan>({
      method: 'GET',
      path: `/subscription-plans/${id}`,
    });
  }

  /**
   * Update a subscription plan
   */
  async updatePlan(id: string, params: UpdatePlanParams): Promise<SubscriptionPlan> {
    return this.client.request<SubscriptionPlan>({
      method: 'PATCH',
      path: `/subscription-plans/${id}`,
      body: params,
    });
  }

  /**
   * Delete a subscription plan
   */
  async deletePlan(id: string): Promise<{ deleted: boolean }> {
    return this.client.request<{ deleted: boolean }>({
      method: 'DELETE',
      path: `/subscription-plans/${id}`,
    });
  }
}
