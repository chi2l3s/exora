import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalPayments: number;
  paymentsChange: number;
  successRate: number;
  successRateChange: number;
  activeCustomers: number;
  customersChange: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  payments: number;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string, fromDate?: Date, toDate?: Date): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month payments
    const currentPayments = await this.prisma.payment.findMany({
      where: {
        userId,
        createdAt: { gte: fromDate || startOfMonth, lte: toDate || now },
      },
    });

    // Last month payments
    const lastMonthPayments = await this.prisma.payment.findMany({
      where: {
        userId,
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    });

    // Calculate stats
    const totalRevenue = currentPayments
      .filter((p) => p.status === 'succeeded')
      .reduce((sum, p) => sum + p.amount, 0);

    const lastMonthRevenue = lastMonthPayments
      .filter((p) => p.status === 'succeeded')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPayments = currentPayments.length;
    const lastMonthTotalPayments = lastMonthPayments.length;

    const successfulPayments = currentPayments.filter((p) => p.status === 'succeeded').length;
    const lastMonthSuccessful = lastMonthPayments.filter((p) => p.status === 'succeeded').length;

    const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;
    const lastMonthSuccessRate = lastMonthTotalPayments > 0 ? (lastMonthSuccessful / lastMonthTotalPayments) * 100 : 0;

    // Active customers (made at least one payment this month)
    const activeCustomerIds = new Set(currentPayments.filter((p) => p.customerId).map((p) => p.customerId));
    const lastMonthActiveCustomerIds = new Set(lastMonthPayments.filter((p) => p.customerId).map((p) => p.customerId));

    const activeCustomers = activeCustomerIds.size;
    const lastMonthActiveCustomers = lastMonthActiveCustomerIds.size;

    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0
      ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : totalRevenue > 0 ? 100 : 0;

    const paymentsChange = lastMonthTotalPayments > 0
      ? ((totalPayments - lastMonthTotalPayments) / lastMonthTotalPayments) * 100
      : totalPayments > 0 ? 100 : 0;

    const successRateChange = lastMonthSuccessRate > 0
      ? successRate - lastMonthSuccessRate
      : successRate > 0 ? successRate : 0;

    const customersChange = lastMonthActiveCustomers > 0
      ? ((activeCustomers - lastMonthActiveCustomers) / lastMonthActiveCustomers) * 100
      : activeCustomers > 0 ? 100 : 0;

    return {
      totalRevenue,
      revenueChange,
      totalPayments,
      paymentsChange,
      successRate,
      successRateChange,
      activeCustomers,
      customersChange,
    };
  }

  async getRevenueChart(
    userId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'month',
  ): Promise<RevenueChartData[]> {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        groupBy = 'hour';
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = 'day';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupBy = 'day';
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        groupBy = 'month';
        break;
    }

    const payments = await this.prisma.payment.findMany({
      where: {
        userId,
        status: 'succeeded',
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group payments by date
    const grouped = new Map<string, { revenue: number; payments: number }>();

    payments.forEach((payment) => {
      let key: string;
      const date = payment.createdAt;

      switch (groupBy) {
        case 'hour':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
          break;
        case 'day':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      const existing = grouped.get(key) || { revenue: 0, payments: 0 };
      grouped.set(key, {
        revenue: existing.revenue + payment.amount,
        payments: existing.payments + 1,
      });
    });

    return Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      payments: data.payments,
    }));
  }

  async getPaymentMethodStats(userId: string): Promise<PaymentMethodStats[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const payments = await this.prisma.payment.findMany({
      where: {
        userId,
        status: 'succeeded',
        createdAt: { gte: startOfMonth },
      },
    });

    const methodStats = new Map<string, { count: number; amount: number }>();
    let totalAmount = 0;

    payments.forEach((payment) => {
      const method = payment.method || 'unknown';
      const existing = methodStats.get(method) || { count: 0, amount: 0 };
      methodStats.set(method, {
        count: existing.count + 1,
        amount: existing.amount + payment.amount,
      });
      totalAmount += payment.amount;
    });

    return Array.from(methodStats.entries()).map(([method, data]) => ({
      method,
      count: data.count,
      amount: data.amount,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    }));
  }

  async getRecentPayments(userId: string, limit: number = 10) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getOverview(userId: string) {
    const [stats, recentPayments, revenueChart, paymentMethods] = await Promise.all([
      this.getStats(userId),
      this.getRecentPayments(userId, 5),
      this.getRevenueChart(userId, 'month'),
      this.getPaymentMethodStats(userId),
    ]);

    return {
      stats,
      recentPayments,
      revenueChart,
      paymentMethods,
    };
  }
}
