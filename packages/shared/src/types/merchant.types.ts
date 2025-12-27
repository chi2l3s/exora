// Merchant Status
export type MerchantStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';

// Verification Status
export type VerificationStatus =
  | 'NOT_VERIFIED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED';

// Merchant Object
export interface Merchant {
  id: string;
  email: string;
  companyName: string;
  legalName?: string;
  inn?: string;
  kpp?: string;
  phone?: string;
  website?: string;
  status: MerchantStatus;
  verificationStatus: VerificationStatus;
  settings: Record<string, unknown>;
  timezone: string;
  currency: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  transactionLimit?: number;
  feePercent: number;
  fixedFee: number;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Project Object
export interface Project {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  website?: string;
  isLive: boolean;
  settings: Record<string, unknown>;
  logoUrl?: string;
  brandColor?: string;
  allowedMethods: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Create Project Input
export interface CreateProjectInput {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  brandColor?: string;
  allowedMethods?: string[];
}

// Update Project Input
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  brandColor?: string;
  allowedMethods?: string[];
  isLive?: boolean;
}

// Update Merchant Profile Input
export interface UpdateMerchantProfileInput {
  companyName?: string;
  legalName?: string;
  inn?: string;
  kpp?: string;
  phone?: string;
  website?: string;
  timezone?: string;
  currency?: string;
  settings?: Record<string, unknown>;
}
