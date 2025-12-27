// Refund Status
export type RefundStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';

// Refund Reasons
export type RefundReason =
  | 'REQUESTED_BY_CUSTOMER'
  | 'DUPLICATE'
  | 'FRAUDULENT'
  | 'ORDER_CANCELLED'
  | 'OTHER';

// Refund Object
export interface Refund {
  id: string;
  merchantId: string;
  transactionId: string;
  amount: number;
  reason?: string;
  description?: string;
  status: RefundStatus;
  failureCode?: string;
  failureMessage?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create Refund Input
export interface CreateRefundInput {
  paymentId: string;
  amount?: number; // If not specified, full refund
  reason?: RefundReason;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Refund Filters
export interface RefundFilters {
  paymentId?: string;
  status?: RefundStatus | RefundStatus[];
  startDate?: Date;
  endDate?: Date;
}
