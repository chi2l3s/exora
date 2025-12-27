import { z } from 'zod';

// Create Customer Input
export const CreateCustomerInputSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string().max(255).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Update Customer Input
export const UpdateCustomerInputSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().max(255).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Customer Filters
export const CustomerFiltersSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Export types
export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;
export type CustomerFilters = z.infer<typeof CustomerFiltersSchema>;
