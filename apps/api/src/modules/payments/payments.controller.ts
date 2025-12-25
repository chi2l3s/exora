import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, RefundPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(userId, createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all payments' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAll(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.findAll(userId, { limit, offset, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by ID' })
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.paymentsService.findOne(userId, id);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm a payment' })
  confirm(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.paymentsService.confirm(userId, id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a payment' })
  cancel(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.paymentsService.cancel(userId, id);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Refund a payment' })
  refund(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() refundDto: RefundPaymentDto,
  ) {
    return this.paymentsService.refund(userId, id, refundDto.amount);
  }
}
