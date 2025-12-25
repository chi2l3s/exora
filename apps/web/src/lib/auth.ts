import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      companyName: string | null;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    role: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('RefreshAccessTokenError');
    }

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            companyName: data.user.companyName,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days
        };
      }

      // Handle session update
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...session.user,
        };
      }

      // Return previous token if the access token has not expired
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        companyName: token.companyName,
        role: token.role,
      };
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-change-in-production',
};
