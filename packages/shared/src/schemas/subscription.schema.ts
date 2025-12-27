import { z } from 'zod';

// Subscription Status
export const SubscriptionStatusSchema = z.enum([
  'ACTIVE',
  'PAST_DUE',
  'CANCELLED',
  'UNPAID',
  'PAUSED',
  'TRIALING',
]);

// Subscription Interval
export const SubscriptionIntervalSchema = z.enum([
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
]);

// Create Subscription Plan Input
export const CreateSubscriptionPlanInputSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  interval: SubscriptionIntervalSchema,
  intervalCount: z.number().int().positive().default(1),
  trialDays: z.number().int().nonnegative().default(0),
  metadata: z.record(z.unknown()).optional(),
});

// Update Subscription Plan Input
export const UpdateSubscriptionPlanInputSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Create Subscription Input
export const CreateSubscriptionInputSchema = z.object({
  customerId: z.string().min(1),
  planId: z.string().optional(),
  amount: z.number().int().positive().optional(),
  currency: z.string().length(3).optional(),
  interval: SubscriptionIntervalSchema.optional(),
  intervalCount: z.number().int().positive().optional(),
  trialDays: z.number().int().nonnegative().optional(),
  paymentTokenId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Update Subscription Input
export const UpdateSubscriptionInputSchema = z.object({
  planId: z.string().optional(),
  amount: z.number().int().positive().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Cancel Subscription Input
export const CancelSubscriptionInputSchema = z.object({
  cancelAtPeriodEnd: z.boolean().default(false),
});

// Subscription Filters
export const SubscriptionFiltersSchema = z.object({
  status: z.union([SubscriptionStatusSchema, z.array(SubscriptionStatusSchema)]).optional(),
  customerId: z.string().optional(),
  planId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Export types
export type CreateSubscriptionPlanInput = z.infer<typeof CreateSubscriptionPlanInputSchema>;
export type UpdateSubscriptionPlanInput = z.infer<typeof UpdateSubscriptionPlanInputSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionInputSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionInputSchema>;
export type CancelSubscriptionInput = z.infer<typeof CancelSubscriptionInputSchema>;
export type SubscriptionFilters = z.infer<typeof SubscriptionFiltersSchema>;
