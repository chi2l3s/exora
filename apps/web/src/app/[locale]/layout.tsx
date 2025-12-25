import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { locales, type Locale } from '@/i18n';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
});

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const messages = await getMessages({ locale });
  const t = (messages as Record<string, Record<string, string>>).metadata;

  return {
    title: {
      default: t.title,
      template: `%s | Exora`,
    },
    description: t.description,
    keywords: [
      'payments',
      'payment processing',
      'fintech',
      'payment api',
      'stripe alternative',
      'payment gateway',
    ],
    authors: [{ name: 'Exora Team' }],
    creator: 'Exora',
    openGraph: {
      type: 'website',
      locale: locale,
      url: 'https://exora.io',
      siteName: 'Exora',
      title: t.title,
      description: t.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
    alternates: {
      languages: Object.fromEntries(locales.map(l => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!locales.includes(locale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
