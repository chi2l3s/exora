import { z } from 'zod';

// Register Input
export const RegisterInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  companyName: z.string().min(1).max(255),
  legalName: z.string().max(255).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
});

// Login Input
export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  twoFactorCode: z.string().length(6).optional(),
});

// Forgot Password Input
export const ForgotPasswordInputSchema = z.object({
  email: z.string().email(),
});

// Reset Password Input
export const ResetPasswordInputSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

// Change Password Input
export const ChangePasswordInputSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

// Verify Two Factor Input
export const VerifyTwoFactorInputSchema = z.object({
  code: z.string().length(6),
});

// Export types
export type RegisterInput = z.infer<typeof RegisterInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordInputSchema>;
export type VerifyTwoFactorInput = z.infer<typeof VerifyTwoFactorInputSchema>;
