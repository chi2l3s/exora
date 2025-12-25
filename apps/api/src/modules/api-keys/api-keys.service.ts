import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiKeyDto } from './dto/api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async create(userId: string, createApiKeyDto: CreateApiKeyDto) {
    const key = this.generateApiKey(createApiKeyDto.isLive);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        id: `ak_${uuidv4().replace(/-/g, '').slice(0, 24)}`,
        userId,
        name: createApiKeyDto.name,
        key,
        isLive: createApiKeyDto.isLive || false,
        isActive: true,
      },
    });

    // Return the full key only once at creation
    return {
      ...apiKey,
      key, // Full key visible only at creation
    };
  }

  async findAll(userId: string) {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // Mask keys for security
    return keys.map(key => ({
      ...key,
      key: this.maskKey(key.key),
    }));
  }

  async findOne(userId: string, id: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id, userId },
    });

    if (!apiKey) {
      throw new NotFoundException(
        await this.i18n.t('errors.apiKey.notFound'),
      );
    }

    return {
      ...apiKey,
      key: this.maskKey(apiKey.key),
    };
  }

  async revoke(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.apiKey.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async rotate(userId: string, id: string) {
    const existingKey = await this.prisma.apiKey.findFirst({
      where: { id, userId },
    });

    if (!existingKey) {
      throw new NotFoundException(
        await this.i18n.t('errors.apiKey.notFound'),
      );
    }

    const newKey = this.generateApiKey(existingKey.isLive);

    const updated = await this.prisma.apiKey.update({
      where: { id },
      data: { key: newKey },
    });

    return {
      ...updated,
      key: newKey, // Full key visible only at rotation
    };
  }

  private generateApiKey(isLive: boolean): string {
    const prefix = isLive ? 'sk_live_' : 'sk_test_';
    const randomPart = crypto.randomBytes(24).toString('hex');
    return `${prefix}${randomPart}`;
  }

  private maskKey(key: string): string {
    const prefix = key.slice(0, 8);
    const suffix = key.slice(-4);
    return `${prefix}...${suffix}`;
  }
}
