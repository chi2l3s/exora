'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Menu, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function DashboardHeader() {
  const t = useTranslations('common');

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-xl px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-full max-w-md pl-10"
          />
        </div>

        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <LanguageSwitcher />
          <ThemeToggle />

          <div className="h-6 w-px bg-border" />

          <Button variant="ghost" size="sm" className="gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
              U
            </div>
            <span className="hidden md:block">User</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
