// Payment Status
export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'REQUIRES_ACTION'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'EXPIRED';

// Payment Methods
export type PaymentMethod =
  | 'CARD'
  | 'SBP'
  | 'QIWI'
  | 'YOOMONEY'
  | 'BANK_TRANSFER'
  | 'CRYPTO'
  | 'WALLET';

// Payment Object
export interface Payment {
  id: string;
  merchantId: string;
  projectId?: string;
  orderId: string;
  externalId?: string;
  amount: number;
  currency: string;
  amountRefunded: number;
  feeAmount: number;
  netAmount: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  description?: string;
  metadata: Record<string, unknown>;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  customerId?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  threeDSecureStatus?: string;
  failureCode?: string;
  failureMessage?: string;
  subscriptionId?: string;
  returnUrl?: string;
  cancelUrl?: string;
  paymentUrl?: string;
  paidAt?: Date;
  cancelledAt?: Date;
  refundedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create Payment Input
export interface CreatePaymentInput {
  amount: number;
  currency: string;
  orderId: string;
  description?: string;
  metadata?: Record<string, unknown>;
  customer?: {
    email?: string;
    phone?: string;
    name?: string;
    id?: string;
  };
  returnUrl?: string;
  cancelUrl?: string;
  paymentMethod?: PaymentMethod;
  capture?: boolean;
  expiresIn?: number; // seconds
}

// Create Payment Response
export interface CreatePaymentResponse {
  payment: Payment;
  paymentUrl: string;
  clientSecret?: string;
}

// Payment Filters
export interface PaymentFilters {
  status?: PaymentStatus | PaymentStatus[];
  paymentMethod?: PaymentMethod | PaymentMethod[];
  customerId?: string;
  orderId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// Payment Statistics
export interface PaymentStats {
  totalAmount: number;
  totalCount: number;
  successfulAmount: number;
  successfulCount: number;
  failedAmount: number;
  failedCount: number;
  refundedAmount: number;
  refundedCount: number;
  averageAmount: number;
  conversionRate: number;
}
