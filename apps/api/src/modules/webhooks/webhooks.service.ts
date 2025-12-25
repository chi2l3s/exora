import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(userId: string, createWebhookDto: CreateWebhookDto) {
    const secret = this.generateSecret();

    return this.prisma.webhookEndpoint.create({
      data: {
        id: `we_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
        userId,
        url: createWebhookDto.url,
        events: createWebhookDto.events,
        secret,
        isActive: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.webhookEndpoint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const webhook = await this.prisma.webhookEndpoint.findFirst({
      where: { id, userId },
    });

    if (!webhook) {
      throw new NotFoundException(
        await this.i18n.t('errors.webhook.notFound'),
      );
    }

    return webhook;
  }

  async update(userId: string, id: string, updateWebhookDto: UpdateWebhookDto) {
    await this.findOne(userId, id);

    return this.prisma.webhookEndpoint.update({
      where: { id },
      data: updateWebhookDto,
    });
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.webhookEndpoint.delete({
      where: { id },
    });
  }

  async trigger(userId: string, event: string, data: any) {
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: {
        userId,
        isActive: true,
        events: { has: event },
      },
    });

    const deliveryPromises = endpoints.map(endpoint =>
      this.deliverWebhook(endpoint, event, data),
    );

    await Promise.allSettled(deliveryPromises);
  }

  private async deliverWebhook(
    endpoint: { id: string; url: string; secret: string },
    event: string,
    data: any,
  ) {
    const payload = {
      id: `evt_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
      type: event,
      created: Date.now(),
      data,
    };

    const signature = this.generateSignature(JSON.stringify(payload), endpoint.secret);

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Exora-Signature': signature,
          'X-Exora-Event': event,
        },
        body: JSON.stringify(payload),
      });

      // Log delivery attempt
      await this.prisma.webhookDelivery.create({
        data: {
          id: `whd_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
          endpointId: endpoint.id,
          event,
          payload,
          responseCode: response.status,
          success: response.ok,
        },
      });

      this.logger.log(`Webhook delivered to ${endpoint.url}: ${response.status}`);
    } catch (error) {
      this.logger.error(`Webhook delivery failed to ${endpoint.url}:`, error);

      await this.prisma.webhookDelivery.create({
        data: {
          id: `whd_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
          endpointId: endpoint.id,
          event,
          payload,
          responseCode: 0,
          success: false,
          error: error.message,
        },
      });
    }
  }

  private generateSecret(): string {
    return `whsec_${crypto.randomBytes(32).toString('hex')}`;
  }

  private generateSignature(payload: string, secret: string): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${payload}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return `t=${timestamp},v1=${signature}`;
  }
}
