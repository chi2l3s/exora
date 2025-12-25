// API Response Types

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  key: string; // Only returned on creation
}

export interface Customer {
  id: string;
  externalId: string | null;
  email: string;
  name: string | null;
  phone: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod =
  | 'card'
  | 'bank_transfer'
  | 'crypto'
  | 'wallet';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod | null;
  description: string | null;
  customerId: string | null;
  customer: Customer | null;
  metadata: Record<string, unknown>;
  failureCode: string | null;
  failureMessage: string | null;
  refundedAmount: number;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'void'
  | 'uncollectible';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  customerId: string;
  customer: Customer | null;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string | null;
  paidAt: string | null;
  items: InvoiceItem[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  description: string | null;
  lastDeliveryAt: string | null;
  lastDeliveryStatus: 'success' | 'failed' | null;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  endpointId: string;
  eventType: string;
  payload: Record<string, unknown>;
  responseStatus: number | null;
  responseBody: string | null;
  attempts: number;
  status: 'pending' | 'success' | 'failed';
  nextRetryAt: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalPayments: number;
  paymentsChange: number;
  successRate: number;
  successRateChange: number;
  activeCustomers: number;
  customersChange: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  payments: number;
}

export interface PaymentMethodStats {
  method: PaymentMethod;
  count: number;
  amount: number;
  percentage: number;
}

// Request DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface CreatePaymentDto {
  amount: number;
  currency: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateInvoiceDto {
  customerId: string;
  currency?: string;
  dueDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  metadata?: Record<string, unknown>;
}

export interface CreateCustomerDto {
  email: string;
  name?: string;
  phone?: string;
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateApiKeyDto {
  name: string;
  expiresAt?: string;
  permissions?: string[];
}

export interface CreateWebhookDto {
  url: string;
  events: string[];
  description?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaymentListParams extends ListParams {
  status?: PaymentStatus;
  customerId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface InvoiceListParams extends ListParams {
  status?: InvoiceStatus;
  customerId?: string;
}
