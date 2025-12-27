import { z } from 'zod';
import { WEBHOOK_EVENTS } from '../constants/webhook-events';

// Webhook Event
export const WebhookEventSchema = z.enum(WEBHOOK_EVENTS as [string, ...string[]]);

// Create Webhook Endpoint Input
export const CreateWebhookEndpointInputSchema = z.object({
  url: z.string().url(),
  events: z.array(WebhookEventSchema).min(1),
  description: z.string().max(500).optional(),
});

// Update Webhook Endpoint Input
export const UpdateWebhookEndpointInputSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(WebhookEventSchema).min(1).optional(),
  isActive: z.boolean().optional(),
});

// Export types
export type CreateWebhookEndpointInput = z.infer<typeof CreateWebhookEndpointInputSchema>;
export type UpdateWebhookEndpointInput = z.infer<typeof UpdateWebhookEndpointInputSchema>;
