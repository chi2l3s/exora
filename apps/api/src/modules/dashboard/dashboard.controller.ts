import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview with all stats' })
  async getOverview(@Req() req: any) {
    return this.dashboardService.getOverview(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async getStats(
    @Req() req: any,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.dashboardService.getStats(
      req.user.id,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
    );
  }

  @Get('revenue-chart')
  @ApiOperation({ summary: 'Get revenue chart data' })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month', 'year'] })
  async getRevenueChart(
    @Req() req: any,
    @Query('period') period?: 'day' | 'week' | 'month' | 'year',
  ) {
    return this.dashboardService.getRevenueChart(req.user.id, period || 'month');
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get payment method statistics' })
  async getPaymentMethodStats(@Req() req: any) {
    return this.dashboardService.getPaymentMethodStats(req.user.id);
  }

  @Get('recent-payments')
  @ApiOperation({ summary: 'Get recent payments' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentPayments(
    @Req() req: any,
    @Query('limit') limit?: number,
  ) {
    return this.dashboardService.getRecentPayments(req.user.id, limit || 10);
  }
}
