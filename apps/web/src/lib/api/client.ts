import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  code?: string;
}

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  locale?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    if (typeof window === 'undefined') {
      return {};
    }

    const session = await getSession();
    if (session?.accessToken) {
      return {
        Authorization: `Bearer ${session.accessToken}`,
      };
    }
    return {};
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, locale, ...init } = options;

    const authHeaders = await this.getAuthHeaders();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept-Language': locale || 'en',
      ...authHeaders,
      ...init.headers,
    };

    const config: RequestInit = {
      ...init,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const url = this.buildUrl(path, params);

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          statusCode: response.status,
          message: response.statusText,
          error: 'Unknown Error',
        }));

        // Handle 401 - redirect to login
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            await signOut({ redirect: true, callbackUrl: '/auth/login' });
          }
        }

        throw new ApiClientError(
          error.statusCode || response.status,
          error.code || 'api_error',
          error.message || 'An error occurred',
          error.details
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Network error
      throw new ApiClientError(
        0,
        'network_error',
        'Unable to connect to server. Please check your internet connection.',
      );
    }
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body });
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body });
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body });
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
