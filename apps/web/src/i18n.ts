import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ru', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'UTC',
    now: new Date(),
  };
});
