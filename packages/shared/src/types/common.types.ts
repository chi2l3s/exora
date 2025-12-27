// Pagination
export interface PaginationInput {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// Sorting
export type SortOrder = 'asc' | 'desc';

export interface SortInput {
  field: string;
  order: SortOrder;
}

// Date Range
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Group By for Analytics
export type GroupBy = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

// Revenue Report
export interface RevenueReport {
  startDate: Date;
  endDate: Date;
  groupBy: GroupBy;
  data: RevenueDataPoint[];
  summary: {
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    totalFees: number;
    netRevenue: number;
  };
}

export interface RevenueDataPoint {
  date: Date;
  revenue: number;
  transactions: number;
  fees: number;
  netRevenue: number;
}

// Conversion Report
export interface ConversionReport {
  startDate: Date;
  endDate: Date;
  totalAttempts: number;
  successfulPayments: number;
  failedPayments: number;
  conversionRate: number;
  byPaymentMethod: {
    method: string;
    attempts: number;
    successful: number;
    conversionRate: number;
  }[];
}

// Error Response
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

// Currencies
export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'KZT' | 'BYN' | 'UAH';

// Locales
export type Locale = 'en' | 'ru' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko';
