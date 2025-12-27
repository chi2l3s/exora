// API Key Type
export type ApiKeyType = 'LIVE' | 'TEST';

// API Key Object
export interface ApiKey {
  id: string;
  merchantId: string;
  projectId?: string;
  name: string;
  keyPrefix: string;
  type: ApiKeyType;
  permissions: string[];
  ipWhitelist: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create API Key Input
export interface CreateApiKeyInput {
  name: string;
  type: ApiKeyType;
  projectId?: string;
  permissions?: string[];
  ipWhitelist?: string[];
  rateLimit?: number;
  expiresAt?: Date;
}

// Create API Key Response (includes the actual key - shown only once)
export interface CreateApiKeyResponse {
  apiKey: ApiKey;
  key: string; // The full API key - only shown at creation
}

// Update API Key Input
export interface UpdateApiKeyInput {
  name?: string;
  permissions?: string[];
  ipWhitelist?: string[];
  rateLimit?: number;
  isActive?: boolean;
  expiresAt?: Date;
}

// API Key Permissions
export const API_KEY_PERMISSIONS = {
  // Payments
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_WRITE: 'payments:write',
  // Refunds
  REFUNDS_READ: 'refunds:read',
  REFUNDS_WRITE: 'refunds:write',
  // Subscriptions
  SUBSCRIPTIONS_READ: 'subscriptions:read',
  SUBSCRIPTIONS_WRITE: 'subscriptions:write',
  // Customers
  CUSTOMERS_READ: 'customers:read',
  CUSTOMERS_WRITE: 'customers:write',
  // Payouts
  PAYOUTS_READ: 'payouts:read',
  PAYOUTS_WRITE: 'payouts:write',
  // Balance
  BALANCE_READ: 'balance:read',
  // Webhooks
  WEBHOOKS_READ: 'webhooks:read',
  WEBHOOKS_WRITE: 'webhooks:write',
  // API Keys
  API_KEYS_READ: 'api_keys:read',
  API_KEYS_WRITE: 'api_keys:write',
} as const;

export type ApiKeyPermission =
  (typeof API_KEY_PERMISSIONS)[keyof typeof API_KEY_PERMISSIONS];
