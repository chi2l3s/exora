// Subscription Status
export type SubscriptionStatus =
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'UNPAID'
  | 'PAUSED'
  | 'TRIALING';

// Subscription Interval
export type SubscriptionInterval = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

// Subscription Plan
export interface SubscriptionPlan {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount: number;
  trialDays: number;
  isActive: boolean;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Object
export interface Subscription {
  id: string;
  merchantId: string;
  customerId: string;
  customerEmail: string;
  planId?: string;
  plan?: SubscriptionPlan;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelledAt?: Date;
  endedAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  paymentTokenId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Create Subscription Input
export interface CreateSubscriptionInput {
  customerId: string;
  planId?: string;
  amount?: number;
  currency?: string;
  interval?: SubscriptionInterval;
  intervalCount?: number;
  trialDays?: number;
  paymentTokenId?: string;
  metadata?: Record<string, unknown>;
}

// Update Subscription Input
export interface UpdateSubscriptionInput {
  planId?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
}

// Create Plan Input
export interface CreateSubscriptionPlanInput {
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: SubscriptionInterval;
  intervalCount?: number;
  trialDays?: number;
  metadata?: Record<string, unknown>;
}

// Subscription Filters
export interface SubscriptionFilters {
  status?: SubscriptionStatus | SubscriptionStatus[];
  customerId?: string;
  planId?: string;
  startDate?: Date;
  endDate?: Date;
}
