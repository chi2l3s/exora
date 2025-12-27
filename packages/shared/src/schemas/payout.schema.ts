import { z } from 'zod';

// Payout Status
export const PayoutStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
]);

// Create Payout Input
export const CreatePayoutInputSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  bankAccount: z.string().length(20),
  bankName: z.string().max(255).optional(),
  bik: z.string().length(9),
  description: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Payout Filters
export const PayoutFiltersSchema = z.object({
  status: z.union([PayoutStatusSchema, z.array(PayoutStatusSchema)]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.number().int().positive().optional(),
  maxAmount: z.number().int().positive().optional(),
});

// Export types
export type CreatePayoutInput = z.infer<typeof CreatePayoutInputSchema>;
export type PayoutFilters = z.infer<typeof PayoutFiltersSchema>;
