import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async validate(req: Request) {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    // For now, we'll use a simple lookup. In production, you'd hash and compare.
    const key = await this.prisma.apiKey.findFirst({
      where: {
        key: apiKey,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!key) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Update last used timestamp
    await this.prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      id: key.user.id,
      email: key.user.email,
      apiKeyId: key.id,
      isLive: key.isLive,
    };
  }
}
