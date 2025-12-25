import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsArray, IsOptional, IsBoolean, ArrayNotEmpty } from 'class-validator';

const WEBHOOK_EVENTS = [
  'payment.created',
  'payment.succeeded',
  'payment.failed',
  'payment.canceled',
  'payment.refunded',
  'invoice.created',
  'invoice.sent',
  'invoice.paid',
  'invoice.overdue',
  'customer.created',
  'customer.updated',
  'customer.deleted',
];

export class CreateWebhookDto {
  @ApiProperty({ example: 'https://example.com/webhooks' })
  @IsUrl()
  url: string;

  @ApiProperty({
    example: ['payment.created', 'payment.succeeded'],
    description: 'List of events to subscribe to',
  })
  @IsArray()
  @ArrayNotEmpty()
  events: string[];
}

export class UpdateWebhookDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  events?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
