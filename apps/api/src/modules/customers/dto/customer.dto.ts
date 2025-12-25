import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '+1-555-123-4567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'cust_external_123' })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ example: { tier: 'premium' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
