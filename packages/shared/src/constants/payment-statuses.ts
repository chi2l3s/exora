import type { PaymentStatus, PaymentMethod } from '../types';

// Payment Status Labels
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  REQUIRES_ACTION: 'Requires Action',
  SUCCEEDED: 'Succeeded',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partially Refunded',
  EXPIRED: 'Expired',
};

// Payment Status Colors (Tailwind classes)
export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  REQUIRES_ACTION: 'bg-orange-100 text-orange-800',
  SUCCEEDED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-purple-100 text-purple-800',
  PARTIALLY_REFUNDED: 'bg-indigo-100 text-indigo-800',
  EXPIRED: 'bg-gray-100 text-gray-600',
};

// Final Statuses (no more changes expected)
export const FINAL_PAYMENT_STATUSES: PaymentStatus[] = [
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
  'REFUNDED',
  'EXPIRED',
];

// Refundable Statuses
export const REFUNDABLE_STATUSES: PaymentStatus[] = [
  'SUCCEEDED',
  'PARTIALLY_REFUNDED',
];

// Payment Method Labels
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD: 'Bank Card',
  SBP: 'SBP (Fast Payment System)',
  QIWI: 'QIWI Wallet',
  YOOMONEY: 'YooMoney',
  BANK_TRANSFER: 'Bank Transfer',
  CRYPTO: 'Cryptocurrency',
  WALLET: 'E-Wallet',
};

// Payment Method Icons
export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  CARD: 'credit-card',
  SBP: 'banknote',
  QIWI: 'wallet',
  YOOMONEY: 'wallet',
  BANK_TRANSFER: 'building-columns',
  CRYPTO: 'bitcoin',
  WALLET: 'wallet',
};

// All Payment Methods
export const ALL_PAYMENT_METHODS: PaymentMethod[] = [
  'CARD',
  'SBP',
  'QIWI',
  'YOOMONEY',
  'BANK_TRANSFER',
  'CRYPTO',
  'WALLET',
];
