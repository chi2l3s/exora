import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/api-key.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('API Keys')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API key' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createApiKeyDto: CreateApiKeyDto,
  ) {
    return this.apiKeysService.create(userId, createApiKeyDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all API keys' })
  findAll(@CurrentUser('id') userId: string) {
    return this.apiKeysService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API key by ID' })
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.apiKeysService.findOne(userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke an API key' })
  revoke(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.apiKeysService.revoke(userId, id);
  }

  @Post(':id/rotate')
  @ApiOperation({ summary: 'Rotate an API key' })
  rotate(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.apiKeysService.rotate(userId, id);
  }
}
