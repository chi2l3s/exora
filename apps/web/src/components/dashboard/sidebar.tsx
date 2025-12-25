'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Link } from '@/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  Key,
  Webhook,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'customers', href: '/dashboard/customers', icon: Users },
  { name: 'invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'apiKeys', href: '/dashboard/api-keys', icon: Key },
  { name: 'webhooks', href: '/dashboard/webhooks', icon: Webhook },
  { name: 'settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardSidebar() {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLinks = () => (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-1">
        {navigation.map((item) => {
          const isActive = pathname.endsWith(item.href) ||
            (item.href === '/dashboard' && pathname.endsWith('/dashboard'));

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'group flex gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.name === 'overview' ? t('overview.title') : t(`${item.name}.title`)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          isMobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className="fixed inset-0 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-background border-r p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">Exora</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <NavLinks />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl">Exora</span>
            </Link>
          </div>
          <NavLinks />
        </div>
      </div>
    </>
  );
}
