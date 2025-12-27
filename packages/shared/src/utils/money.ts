import { CURRENCIES, type CurrencyConfig } from '../constants/currencies';
import type { Currency } from '../types';

/**
 * Format amount from smallest unit (e.g., kopecks) to display format
 */
export function formatMoney(
  amount: number,
  currency: Currency,
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    locale?: string;
  } = {}
): string {
  const { showSymbol = true, showCode = false, locale = 'en-US' } = options;
  const config = CURRENCIES[currency];

  if (!config) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  const value = amount / Math.pow(10, config.decimalPlaces);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(value);

  if (showCode) {
    return `${formatted} ${currency}`;
  }

  if (showSymbol) {
    if (config.symbolPosition === 'before') {
      return `${config.symbol}${formatted}`;
    }
    return `${formatted} ${config.symbol}`;
  }

  return formatted;
}

/**
 * Parse display amount to smallest unit
 */
export function parseMoney(displayAmount: number | string, currency: Currency): number {
  const config = CURRENCIES[currency];

  if (!config) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  const value = typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount;

  if (isNaN(value)) {
    throw new Error('Invalid amount');
  }

  return Math.round(value * Math.pow(10, config.decimalPlaces));
}

/**
 * Get currency configuration
 */
export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  const config = CURRENCIES[currency];

  if (!config) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  return config;
}

/**
 * Calculate fee for a payment
 */
export function calculateFee(
  amount: number,
  feePercent: number,
  fixedFee: number = 0
): number {
  const percentFee = Math.round((amount * feePercent) / 100);
  return percentFee + fixedFee;
}

/**
 * Calculate net amount after fees
 */
export function calculateNetAmount(
  amount: number,
  feePercent: number,
  fixedFee: number = 0
): number {
  const fee = calculateFee(amount, feePercent, fixedFee);
  return amount - fee;
}

/**
 * Convert amount between currencies (placeholder - needs exchange rates)
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRate: number
): number {
  const fromConfig = CURRENCIES[fromCurrency];
  const toConfig = CURRENCIES[toCurrency];

  if (!fromConfig || !toConfig) {
    throw new Error('Unsupported currency');
  }

  // Convert to base units, apply rate, convert to target units
  const converted = amount * exchangeRate;

  // Adjust for decimal place differences
  const decimalDiff = toConfig.decimalPlaces - fromConfig.decimalPlaces;
  return Math.round(converted * Math.pow(10, decimalDiff));
}

/**
 * Validate amount is within allowed range
 */
export function validateAmount(
  amount: number,
  currency: Currency,
  minAmount?: number,
  maxAmount?: number
): { valid: boolean; error?: string } {
  if (!Number.isInteger(amount) || amount <= 0) {
    return { valid: false, error: 'Amount must be a positive integer' };
  }

  if (minAmount !== undefined && amount < minAmount) {
    return {
      valid: false,
      error: `Amount must be at least ${formatMoney(minAmount, currency)}`,
    };
  }

  if (maxAmount !== undefined && amount > maxAmount) {
    return {
      valid: false,
      error: `Amount cannot exceed ${formatMoney(maxAmount, currency)}`,
    };
  }

  return { valid: true };
}
