'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function Footer() {
  const t = useTranslations('landing.footer');
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      key: 'products',
      links: ['payments', 'subscriptions', 'invoicing', 'connect', 'terminal'],
    },
    {
      key: 'developers',
      links: ['documentation', 'apiReference', 'sdks', 'plugins', 'samples'],
    },
    {
      key: 'company',
      links: ['about', 'blog', 'careers', 'press', 'partners'],
    },
    {
      key: 'legal',
      links: ['privacy', 'terms', 'cookies', 'compliance'],
    },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Logo and controls */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">Exora</span>
            </Link>
            <div className="flex items-center gap-2 mb-6">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('copyright', { year: currentYear })}
            </p>
          </div>

          {/* Links sections */}
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="font-semibold mb-4">{t(`${section.key}.title`)}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {t(`${section.key}.${link}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
