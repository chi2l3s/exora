'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, CreditCard, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, cn } from '@/lib/utils';
import { useDashboardOverview, useRecentPayments } from '@/hooks';
import type { Payment } from '@/lib/api/types';

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  loading?: boolean;
}) {
  const isPositive = change >= 0;
  const t = useTranslations('dashboard.overview');

  if (loading) {
    return (
      <Card className="hover-lift">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span className={cn(isPositive ? 'text-green-500' : 'text-red-500')}>
            {isPositive ? '+' : ''}
            {change.toFixed(1)}%
          </span>{' '}
          {t('comparedToLastMonth')}
        </p>
      </CardContent>
    </Card>
  );
}

function PaymentStatusBadge({ status }: { status: Payment['status'] }) {
  const statusStyles: Record<Payment['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    succeeded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    partially_refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

function RecentPaymentsCard({ payments, loading }: { payments?: Payment[]; loading: boolean }) {
  const t = useTranslations('dashboard');

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>{t('recentPayments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>{t('recentPayments')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {payments && payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {payment.customer?.name?.[0] || payment.customer?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {payment.customer?.name || payment.customer?.email || t('anonymousCustomer')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.description || payment.id.slice(0, 8)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(payment.amount / 100, payment.currency)}
                  </p>
                  <PaymentStatusBadge status={payment.status} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('noRecentPayments')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueChart({ loading }: { loading: boolean }) {
  const t = useTranslations('dashboard');

  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>{t('revenueChart')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>{t('revenueChart')}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-sm">{t('chartComingSoon')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: session } = useSession();
  const { data: overview, isLoading: overviewLoading } = useDashboardOverview();
  const { data: recentPayments, isLoading: paymentsLoading } = useRecentPayments(5);

  const userName = session?.user?.firstName || session?.user?.email?.split('@')[0] || 'User';

  const stats = overview?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('overview.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('welcome', { name: userName })}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('overview.totalRevenue')}
          value={formatCurrency(stats?.totalRevenue || 0, 'USD')}
          change={stats?.revenueChange || 0}
          icon={DollarSign}
          loading={overviewLoading}
        />
        <StatCard
          title={t('overview.totalTransactions')}
          value={formatNumber(stats?.totalPayments || 0)}
          change={stats?.paymentsChange || 0}
          icon={CreditCard}
          loading={overviewLoading}
        />
        <StatCard
          title={t('overview.successRate')}
          value={formatPercent(stats?.successRate || 0)}
          change={stats?.successRateChange || 0}
          icon={TrendingUp}
          loading={overviewLoading}
        />
        <StatCard
          title={t('overview.activeCustomers')}
          value={formatNumber(stats?.activeCustomers || 0)}
          change={stats?.customersChange || 0}
          icon={Users}
          loading={overviewLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart loading={overviewLoading} />
        <RecentPaymentsCard payments={recentPayments} loading={paymentsLoading} />
      </div>
    </div>
  );
}
