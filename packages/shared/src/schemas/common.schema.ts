import { z } from 'zod';

// Pagination Input
export const PaginationInputSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  cursor: z.string().optional(),
});

// Sort Order
export const SortOrderSchema = z.enum(['asc', 'desc']);

// Sort Input
export const SortInputSchema = z.object({
  field: z.string(),
  order: SortOrderSchema.default('desc'),
});

// Date Range Input
export const DateRangeInputSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

// Group By
export const GroupBySchema = z.enum(['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR']);

// ID Param
export const IdParamSchema = z.object({
  id: z.string().min(1),
});

// Search Query
export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(255),
});

// Export types
export type PaginationInput = z.infer<typeof PaginationInputSchema>;
export type SortInput = z.infer<typeof SortInputSchema>;
export type DateRangeInput = z.infer<typeof DateRangeInputSchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
