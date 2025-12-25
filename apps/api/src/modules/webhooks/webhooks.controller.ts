import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Webhooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new webhook endpoint' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createWebhookDto: CreateWebhookDto,
  ) {
    return this.webhooksService.create(userId, createWebhookDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all webhook endpoints' })
  findAll(@CurrentUser('id') userId: string) {
    return this.webhooksService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a webhook endpoint by ID' })
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.webhooksService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a webhook endpoint' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateWebhookDto: UpdateWebhookDto,
  ) {
    return this.webhooksService.update(userId, id, updateWebhookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a webhook endpoint' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.webhooksService.delete(userId, id);
  }
}
