import { z } from 'zod';

// Payment Status
export const PaymentStatusSchema = z.enum([
  'PENDING',
  'PROCESSING',
  'REQUIRES_ACTION',
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
  'EXPIRED',
]);

// Payment Method
export const PaymentMethodSchema = z.enum([
  'CARD',
  'SBP',
  'QIWI',
  'YOOMONEY',
  'BANK_TRANSFER',
  'CRYPTO',
  'WALLET',
]);

// Customer Input
export const CustomerInputSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  id: z.string().optional(),
});

// Create Payment Input
export const CreatePaymentInputSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  orderId: z.string().min(1).max(255),
  description: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
  customer: CustomerInputSchema.optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  paymentMethod: PaymentMethodSchema.optional(),
  capture: z.boolean().optional(),
  expiresIn: z.number().int().positive().optional(),
});

// Capture Payment Input
export const CapturePaymentInputSchema = z.object({
  amount: z.number().int().positive().optional(),
});

// Cancel Payment Input
export const CancelPaymentInputSchema = z.object({
  reason: z.string().max(500).optional(),
});

// Payment Filters
export const PaymentFiltersSchema = z.object({
  status: z.union([PaymentStatusSchema, z.array(PaymentStatusSchema)]).optional(),
  paymentMethod: z.union([PaymentMethodSchema, z.array(PaymentMethodSchema)]).optional(),
  customerId: z.string().optional(),
  orderId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.number().int().positive().optional(),
  maxAmount: z.number().int().positive().optional(),
});

// Export types
export type CreatePaymentInput = z.infer<typeof CreatePaymentInputSchema>;
export type CapturePaymentInput = z.infer<typeof CapturePaymentInputSchema>;
export type CancelPaymentInput = z.infer<typeof CancelPaymentInputSchema>;
export type PaymentFilters = z.infer<typeof PaymentFiltersSchema>;
