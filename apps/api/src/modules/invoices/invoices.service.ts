import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto/invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(userId: string, createInvoiceDto: CreateInvoiceDto) {
    const invoiceNumber = await this.generateInvoiceNumber(userId);

    return this.prisma.invoice.create({
      data: {
        id: `inv_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
        userId,
        number: invoiceNumber,
        customerId: createInvoiceDto.customerId,
        customerEmail: createInvoiceDto.customerEmail,
        amount: createInvoiceDto.amount,
        currency: createInvoiceDto.currency.toLowerCase(),
        status: 'draft',
        dueDate: createInvoiceDto.dueDate ? new Date(createInvoiceDto.dueDate) : null,
        items: createInvoiceDto.items || [],
        metadata: createInvoiceDto.metadata || {},
      },
    });
  }

  async findAll(userId: string, options: { limit?: number; offset?: number; status?: string }) {
    const { limit = 10, offset = 0, status } = options;

    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + invoices.length < total,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      throw new NotFoundException(
        await this.i18n.t('errors.invoice.notFound'),
      );
    }

    return invoice;
  }

  async update(userId: string, id: string, updateInvoiceDto: UpdateInvoiceDto) {
    await this.findOne(userId, id);

    return this.prisma.invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  async send(userId: string, id: string) {
    const invoice = await this.findOne(userId, id);

    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
  }

  async markAsPaid(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }

  async void(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.invoice.update({
      where: { id },
      data: { status: 'void' },
    });
  }

  private async generateInvoiceNumber(userId: string): Promise<string> {
    const count = await this.prisma.invoice.count({
      where: { userId },
    });

    const year = new Date().getFullYear();
    return `INV-${year}-${String(count + 1).padStart(6, '0')}`;
  }
}
