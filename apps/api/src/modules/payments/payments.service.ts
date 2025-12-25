import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly webhooksService: WebhooksService,
    private readonly i18n: I18nService,
  ) {}

  async create(userId: string, createPaymentDto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        id: `pay_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
        userId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency.toLowerCase(),
        status: 'pending',
        customerId: createPaymentDto.customerId,
        description: createPaymentDto.description,
        metadata: createPaymentDto.metadata || {},
      },
    });

    // Trigger webhook
    await this.webhooksService.trigger(userId, 'payment.created', payment);

    return payment;
  }

  async findAll(userId: string, options: { limit?: number; offset?: number; status?: string }) {
    const { limit = 10, offset = 0, status } = options;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + payments.length < total,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, userId },
    });

    if (!payment) {
      throw new NotFoundException(
        await this.i18n.t('errors.payment.notFound'),
      );
    }

    return payment;
  }

  async confirm(userId: string, id: string) {
    const payment = await this.findOne(userId, id);

    if (payment.status !== 'pending') {
      throw new BadRequestException(
        await this.i18n.t('errors.payment.cannotConfirm'),
      );
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status: 'succeeded' },
    });

    await this.webhooksService.trigger(userId, 'payment.succeeded', updated);

    return updated;
  }

  async cancel(userId: string, id: string) {
    const payment = await this.findOne(userId, id);

    if (payment.status !== 'pending') {
      throw new BadRequestException(
        await this.i18n.t('errors.payment.cannotCancel'),
      );
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status: 'canceled' },
    });

    await this.webhooksService.trigger(userId, 'payment.canceled', updated);

    return updated;
  }

  async refund(userId: string, id: string, amount?: number) {
    const payment = await this.findOne(userId, id);

    if (payment.status !== 'succeeded') {
      throw new BadRequestException(
        await this.i18n.t('errors.payment.cannotRefund'),
      );
    }

    const refundAmount = amount || payment.amount;

    if (refundAmount > payment.amount) {
      throw new BadRequestException(
        await this.i18n.t('errors.payment.refundExceedsAmount'),
      );
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: refundAmount === payment.amount ? 'refunded' : 'partially_refunded',
        refundedAmount: { increment: refundAmount },
      },
    });

    await this.webhooksService.trigger(userId, 'payment.refunded', {
      ...updated,
      refundAmount,
    });

    return updated;
  }
}
