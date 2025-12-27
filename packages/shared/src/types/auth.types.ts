import type { Merchant } from './merchant.types';

// Register Input
export interface RegisterInput {
  email: string;
  password: string;
  companyName: string;
  legalName?: string;
  phone?: string;
  website?: string;
}

// Login Input
export interface LoginInput {
  email: string;
  password: string;
  twoFactorCode?: string;
}

// Auth Response
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  merchant: Merchant;
}

// Two Factor Setup
export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

// Password Reset
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

// Change Password
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
