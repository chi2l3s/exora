import type { Currency } from '../types';

// Currency Configuration
export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  decimalPlaces: number;
  symbolPosition: 'before' | 'after';
}

// Supported Currencies
export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  RUB: {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    decimalPlaces: 2,
    symbolPosition: 'after',
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimalPlaces: 2,
    symbolPosition: 'before',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimalPlaces: 2,
    symbolPosition: 'before',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimalPlaces: 2,
    symbolPosition: 'before',
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    decimalPlaces: 2,
    symbolPosition: 'before',
  },
  KZT: {
    code: 'KZT',
    name: 'Kazakhstani Tenge',
    symbol: '₸',
    decimalPlaces: 2,
    symbolPosition: 'after',
  },
  BYN: {
    code: 'BYN',
    name: 'Belarusian Ruble',
    symbol: 'Br',
    decimalPlaces: 2,
    symbolPosition: 'after',
  },
  UAH: {
    code: 'UAH',
    name: 'Ukrainian Hryvnia',
    symbol: '₴',
    decimalPlaces: 2,
    symbolPosition: 'after',
  },
};

// All Currency Codes
export const CURRENCY_CODES: Currency[] = Object.keys(CURRENCIES) as Currency[];

// Default Currency
export const DEFAULT_CURRENCY: Currency = 'RUB';

// Minimum amounts (in smallest currency unit, e.g., kopecks for RUB)
export const MINIMUM_AMOUNTS: Record<Currency, number> = {
  RUB: 100, // 1 RUB
  USD: 50, // 0.50 USD
  EUR: 50, // 0.50 EUR
  GBP: 50, // 0.50 GBP
  CNY: 100, // 1 CNY
  KZT: 100, // 1 KZT
  BYN: 100, // 1 BYN
  UAH: 100, // 1 UAH
};

// Maximum amounts (in smallest currency unit)
export const MAXIMUM_AMOUNTS: Record<Currency, number> = {
  RUB: 1000000000, // 10,000,000 RUB
  USD: 100000000, // 1,000,000 USD
  EUR: 100000000, // 1,000,000 EUR
  GBP: 100000000, // 1,000,000 GBP
  CNY: 1000000000, // 10,000,000 CNY
  KZT: 10000000000, // 100,000,000 KZT
  BYN: 1000000000, // 10,000,000 BYN
  UAH: 10000000000, // 100,000,000 UAH
};
