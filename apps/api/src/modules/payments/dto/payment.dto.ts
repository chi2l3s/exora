import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';

const SUPPORTED_CURRENCIES = [
  'usd', 'eur', 'gbp', 'jpy', 'cny', 'krw', 'rub', 'brl', 'inr', 'aud',
];

export class CreatePaymentDto {
  @ApiProperty({ example: 5000, description: 'Amount in smallest currency unit (cents)' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'usd', description: 'Three-letter ISO currency code' })
  @IsString()
  @IsIn(SUPPORTED_CURRENCIES)
  currency: string;

  @ApiProperty({ example: 'cus_123456', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'Payment for order #1234', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: { orderId: '123' }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdatePaymentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class RefundPaymentDto {
  @ApiProperty({ example: 2500, description: 'Amount to refund (optional, defaults to full amount)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;
}
