import apiClient from './client';
import type { AuthResponse, LoginDto, RegisterDto, User } from './types';

export const authApi = {
  login: (data: LoginDto, locale?: string) =>
    apiClient.post<AuthResponse>('/auth/login', data, { locale }),

  register: (data: RegisterDto, locale?: string) =>
    apiClient.post<AuthResponse>('/auth/register', data, { locale }),

  logout: () =>
    apiClient.post<void>('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),

  me: () =>
    apiClient.get<User>('/auth/me'),

  verifyEmail: (token: string) =>
    apiClient.post<void>('/auth/verify-email', { token }),

  forgotPassword: (email: string, locale?: string) =>
    apiClient.post<void>('/auth/forgot-password', { email }, { locale }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<void>('/auth/reset-password', { token, password }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<void>('/auth/change-password', { currentPassword, newPassword }),
};
