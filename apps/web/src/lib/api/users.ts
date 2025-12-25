import apiClient from './client';
import type { User, UpdateUserDto } from './types';

export const usersApi = {
  getProfile: (locale?: string) =>
    apiClient.get<User>('/users/me', { locale }),

  updateProfile: (data: UpdateUserDto, locale?: string) =>
    apiClient.patch<User>('/users/me', data, { locale }),

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me/avatar`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    return response.json() as Promise<{ avatarUrl: string }>;
  },

  deleteAvatar: (locale?: string) =>
    apiClient.delete<void>('/users/me/avatar', { locale }),

  deleteAccount: (locale?: string) =>
    apiClient.delete<void>('/users/me', { locale }),

  getActivityLog: (params?: { page?: number; limit?: number }, locale?: string) =>
    apiClient.get<{
      data: {
        id: string;
        action: string;
        ipAddress: string;
        userAgent: string;
        createdAt: string;
      }[];
      meta: { total: number; page: number; limit: number };
    }>('/users/me/activity', {
      params: params as Record<string, string | number | boolean | undefined>,
      locale,
    }),
};
