import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  IsEmail,
  IsDateString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Min(0)
  unitAmount: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'cus_123456', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: 5000, description: 'Total amount in smallest currency unit' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'usd' })
  @IsString()
  currency: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ type: [InvoiceItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items?: InvoiceItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateInvoiceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
