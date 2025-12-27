import { z } from 'zod';

// API Key Type
export const ApiKeyTypeSchema = z.enum(['LIVE', 'TEST']);

// Create API Key Input
export const CreateApiKeyInputSchema = z.object({
  name: z.string().min(1).max(255),
  type: ApiKeyTypeSchema,
  projectId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  ipWhitelist: z.array(z.string().ip()).optional(),
  rateLimit: z.number().int().positive().max(10000).optional(),
  expiresAt: z.coerce.date().optional(),
});

// Update API Key Input
export const UpdateApiKeyInputSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  permissions: z.array(z.string()).optional(),
  ipWhitelist: z.array(z.string().ip()).optional(),
  rateLimit: z.number().int().positive().max(10000).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.coerce.date().optional(),
});

// Export types
export type CreateApiKeyInput = z.infer<typeof CreateApiKeyInputSchema>;
export type UpdateApiKeyInput = z.infer<typeof UpdateApiKeyInputSchema>;
