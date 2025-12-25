import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'Production API Key' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isLive?: boolean;
}
