import { z } from 'zod';

// Refund Status
export const RefundStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
]);

// Refund Reason
export const RefundReasonSchema = z.enum([
  'REQUESTED_BY_CUSTOMER',
  'DUPLICATE',
  'FRAUDULENT',
  'ORDER_CANCELLED',
  'OTHER',
]);

// Create Refund Input
export const CreateRefundInputSchema = z.object({
  paymentId: z.string().min(1),
  amount: z.number().int().positive().optional(),
  reason: RefundReasonSchema.optional(),
  description: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Refund Filters
export const RefundFiltersSchema = z.object({
  paymentId: z.string().optional(),
  status: z.union([RefundStatusSchema, z.array(RefundStatusSchema)]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Export types
export type CreateRefundInput = z.infer<typeof CreateRefundInputSchema>;
export type RefundFilters = z.infer<typeof RefundFiltersSchema>;
