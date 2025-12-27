import type { ExoraClient } from '../client';
import type {
  Payment,
  CreatePaymentParams,
  CreatePaymentResponse,
  CapturePaymentParams,
  CancelPaymentParams,
  PaymentFilters,
  PaginatedResponse,
} from '../types';

export class Payments {
  constructor(private readonly client: ExoraClient) {}

  /**
   * Create a new payment
   */
  async create(params: CreatePaymentParams): Promise<CreatePaymentResponse> {
    return this.client.request<CreatePaymentResponse>({
      method: 'POST',
      path: '/payments',
      body: params,
    });
  }

  /**
   * List all payments
   */
  async list(params?: PaymentFilters): Promise<PaginatedResponse<Payment>> {
    return this.client.request<PaginatedResponse<Payment>>({
      method: 'GET',
      path: '/payments',
      query: params as Record<string, unknown>,
    });
  }

  /**
   * Retrieve a payment by ID
   */
  async retrieve(id: string): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'GET',
      path: `/payments/${id}`,
    });
  }

  /**
   * Retrieve a payment by order ID
   */
  async retrieveByOrderId(orderId: string): Promise<Payment | null> {
    try {
      return await this.client.request<Payment>({
        method: 'GET',
        path: '/payments/by-order-id',
        query: { orderId },
      });
    } catch {
      return null;
    }
  }

  /**
   * Capture a payment (for hold/capture flow)
   */
  async capture(id: string, params?: CapturePaymentParams): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: `/payments/${id}/capture`,
      body: params,
    });
  }

  /**
   * Cancel a payment
   */
  async cancel(id: string, params?: CancelPaymentParams): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: `/payments/${id}/cancel`,
      body: params,
    });
  }

  /**
   * Confirm a payment (for client-side confirmation)
   */
  async confirm(id: string): Promise<Payment> {
    return this.client.request<Payment>({
      method: 'POST',
      path: `/payments/${id}/confirm`,
    });
  }
}
