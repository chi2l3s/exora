export type Locale = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko';

export interface ExoraOptions {
  apiKey: string;
  baseUrl?: string;
  locale?: Locale;
  timeout?: number;
  maxRetries?: number;
}

export interface ExoraModuleOptions extends ExoraOptions {
  isGlobal?: boolean;
}

export interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: Record<string, any>;
  query?: Record<string, any>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  customerId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  metadata: Record<string, any>;
  refundedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded';

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Invoice types
export interface Invoice {
  id: string;
  userId: string;
  customerId?: string;
  customerEmail: string;
  number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate?: string;
  items: InvoiceItem[];
  metadata: Record<string, any>;
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'void' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitAmount: number;
}

export interface CreateInvoiceParams {
  customerEmail: string;
  amount: number;
  currency: string;
  customerId?: string;
  dueDate?: string;
  items?: InvoiceItem[];
  metadata?: Record<string, any>;
}

// Customer types
export interface Customer {
  id: string;
  userId: string;
  email: string;
  name?: string;
  phone?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

// Webhook types
export interface WebhookEndpoint {
  id: string;
  userId: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookParams {
  url: string;
  events: string[];
}

// API Key types
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  isLive: boolean;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyParams {
  name: string;
  isLive?: boolean;
}
