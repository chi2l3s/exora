import {
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

const DEFAULT_BASE_URL = 'https://api.exora.io';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 3;

export class ExoraClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly locale: Locale;
  private readonly timeout: number;
  private readonly maxRetries: number;

  public readonly payments: Payments;
  public readonly invoices: Invoices;
  public readonly customers: Customers;
  public readonly webhooks: Webhooks;
  public readonly apiKeys: ApiKeys;

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
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, body, query } = options;

    let url = `${this.baseUrl}/api/v1${path}`;

    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
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
      'X-Exora-Client': 'exora-sdk-node/1.0.0',
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

        return await response.json();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof ExoraError && error.statusCode && error.statusCode < 500) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < this.maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new ExoraError({ code: 'api_error', message: 'Request failed' }, this.locale);
  }

  private handleErrorResponse(statusCode: number, data: any): ExoraError {
    const message = data.message || data.error || '';

    switch (statusCode) {
      case 401:
        return new AuthenticationError(message, this.locale);
      case 400:
        return new InvalidRequestError(message, data.details, this.locale);
      case 404:
        return new NotFoundError(message, this.locale);
      case 429:
        return new RateLimitError(message, this.locale);
      default:
        return new ExoraError(
          { code: 'api_error', message, statusCode, details: data },
          this.locale,
        );
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Alias for backward compatibility
export const Exora = ExoraClient;
