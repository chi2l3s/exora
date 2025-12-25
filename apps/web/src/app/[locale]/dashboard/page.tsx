'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, TrendingUp, Users } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  const stats = [
    {
      title: t('overview.totalRevenue'),
      value: formatCurrency(12500000, 'USD'),
      change: '+20.1%',
      icon: DollarSign,
    },
    {
      title: t('overview.totalTransactions'),
      value: formatNumber(12847),
      change: '+15.5%',
      icon: CreditCard,
    },
    {
      title: t('overview.successRate'),
      value: formatPercent(98.5),
      change: '+2.1%',
      icon: TrendingUp,
    },
    {
      title: t('overview.activeCustomers'),
      value: formatNumber(2340),
      change: '+12.3%',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('overview.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('welcome', { name: 'User' })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.change}</span> {t('overview.comparedToLastMonth')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('payments.title')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] flex items-center justify-center text-muted-foreground">
              Revenue Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t('customers.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    U{i}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Customer {i}</p>
                    <p className="text-sm text-muted-foreground">customer{i}@email.com</p>
                  </div>
                  <div className="ml-auto font-medium">{formatCurrency(Math.random() * 100000, 'USD')}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
