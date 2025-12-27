import type {
  ExoraOptions,
  RequestOptions,
  Locale,
} from './types';
import {
  ExoraError,
  AuthenticationError,
  InvalidRequestError,
  NotFoundError,
  RateLimitError,
} from './errors';
import { Payments } from './resources/payments';
import { Invoices } from './resources/invoices';
import { Customers } from './resources/customers';
import { Webhooks } from './resources/webhooks';
import { ApiKeys } from './resources/api-keys';
import { Refunds } from './resources/refunds';
import { Subscriptions } from './resources/subscriptions';
import { Payouts } from './resources/payouts';
import { Balances } from './resources/balances';

const DEFAULT_BASE_URL = 'https://api.exora.io';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 3;
const SDK_VERSION = '1.0.0';

export class ExoraClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly locale: Locale;
  private readonly timeout: number;
  private readonly maxRetries: number;

  // Resources
  public readonly payments: Payments;
  public readonly invoices: Invoices;
  public readonly customers: Customers;
  public readonly webhooks: Webhooks;
  public readonly apiKeys: ApiKeys;
  public readonly refunds: Refunds;
  public readonly subscriptions: Subscriptions;
  public readonly payouts: Payouts;
  public readonly balances: Balances;

  constructor(options: ExoraOptions | string) {
    if (typeof options === 'string') {
      this.apiKey = options;
      this.baseUrl = DEFAULT_BASE_URL;
      this.locale = 'en';
      this.timeout = DEFAULT_TIMEOUT;
      this.maxRetries = DEFAULT_MAX_RETRIES;
    } else {
      this.apiKey = options.apiKey;
      this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
      this.locale = options.locale || 'en';
      this.timeout = options.timeout || DEFAULT_TIMEOUT;
      this.maxRetries = options.maxRetries || DEFAULT_MAX_RETRIES;
    }

    if (!this.apiKey) {
      throw new AuthenticationError('API key is required', this.locale);
    }

    // Initialize resources
    this.payments = new Payments(this);
    this.invoices = new Invoices(this);
    this.customers = new Customers(this);
    this.webhooks = new Webhooks(this);
    this.apiKeys = new ApiKeys(this);
    this.refunds = new Refunds(this);
    this.subscriptions = new Subscriptions(this);
    this.payouts = new Payouts(this);
    this.balances = new Balances(this);
  }

  /**
   * Make an API request
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, body, query } = options;

    let url = `${this.baseUrl}/api/v1${path}`;

    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept-Language': this.locale,
      'X-Exora-Client': `exora-sdk-node/${SDK_VERSION}`,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw this.handleErrorResponse(response.status, errorData);
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        }

        return {} as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof ExoraError && error.statusCode && error.statusCode < 500) {
          throw error;
        }

        // Don't retry on abort
        if (error instanceof Error && error.name === 'AbortError') {
          throw new ExoraError(
            { code: 'timeout', message: 'Request timed out' },
            this.locale
          );
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new ExoraError({ code: 'api_error', message: 'Request failed' }, this.locale);
  }

  private handleErrorResponse(statusCode: number, data: Record<string, unknown>): ExoraError {
    const message = (data.message as string) || (data.error as string) || 'An error occurred';
    const code = (data.code as string) || 'api_error';

    switch (statusCode) {
      case 401:
        return new AuthenticationError(message, this.locale);
      case 400:
        return new InvalidRequestError(message, data.details as Record<string, unknown>, this.locale);
      case 404:
        return new NotFoundError(message, this.locale);
      case 429:
        return new RateLimitError(message, this.locale);
      default:
        return new ExoraError(
          { code, message, statusCode, details: data },
          this.locale,
        );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get SDK version
   */
  static get VERSION(): string {
    return SDK_VERSION;
  }
}

// Alias for backward compatibility
export const Exora = ExoraClient;
