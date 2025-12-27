// Payout Status
export type PayoutStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED';

// Payout Object
export interface Payout {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  feeAmount: number;
  netAmount: number;
  status: PayoutStatus;
  bankAccount?: string;
  bankName?: string;
  bik?: string;
  failureCode?: string;
  failureMessage?: string;
  description?: string;
  metadata: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create Payout Input
export interface CreatePayoutInput {
  amount: number;
  currency: string;
  bankAccount: string;
  bankName?: string;
  bik: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Payout Filters
export interface PayoutFilters {
  status?: PayoutStatus | PayoutStatus[];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// Balance Object
export interface Balance {
  id: string;
  merchantId: string;
  currency: string;
  available: number;
  pending: number;
  reserved: number;
  updatedAt: Date;
}
