# @exora/nestjs

Official NestJS module for [Exora](https://exora.io) payment platform.

## Installation

```bash
npm install @exora/nestjs exora-sdk
# or
pnpm add @exora/nestjs exora-sdk
# or
yarn add @exora/nestjs exora-sdk
```

## Quick Start

### 1. Import the module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ExoraModule } from '@exora/nestjs';

@Module({
  imports: [
    ExoraModule.forRoot({
      apiKey: 'exora_live_xxxxxxxxxxxx',
      webhookSecret: 'whsec_xxxxxxxxxxxx',
    }),
  ],
})
export class AppModule {}
```

### 2. With async configuration

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExoraModule } from '@exora/nestjs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ExoraModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get('EXORA_API_KEY'),
        webhookSecret: config.get('EXORA_WEBHOOK_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

### 3. Use the service

```typescript
// payments.service.ts
import { Injectable } from '@nestjs/common';
import { ExoraService } from '@exora/nestjs';

@Injectable()
export class PaymentsService {
  constructor(private readonly exora: ExoraService) {}

  async createPayment(orderId: string, amount: number) {
    return this.exora.payments.create({
      orderId,
      amount,
      currency: 'RUB',
      description: 'Payment for order',
      returnUrl: 'https://yoursite.com/success',
    });
  }

  async getPayment(paymentId: string) {
    return this.exora.payments.retrieve(paymentId);
  }

  async refundPayment(paymentId: string, amount?: number) {
    return this.exora.payments.refund(paymentId, { amount });
  }
}
```

## Webhook Handling

### Using decorators

```typescript
// webhooks.controller.ts
import { Controller, Post } from '@nestjs/common';
import {
  ExoraWebhookHandler,
  OnExoraEvent,
  Payment,
  Refund,
} from '@exora/nestjs';

@Controller('webhooks')
@ExoraWebhookHandler() // Automatically verifies webhook signature
export class WebhooksController {
  @Post('exora')
  @OnExoraEvent('payment.succeeded')
  async handlePaymentSucceeded(payment: Payment) {
    console.log(`Payment ${payment.id} succeeded!`);
    // Process the successful payment
  }

  @OnExoraEvent('payment.failed')
  async handlePaymentFailed(payment: Payment) {
    console.log(`Payment ${payment.id} failed: ${payment.failureMessage}`);
    // Handle failed payment
  }

  @OnExoraEvent('refund.created')
  async handleRefundCreated(refund: Refund) {
    console.log(`Refund ${refund.id} created`);
    // Process the refund
  }

  // Handle all events
  @OnExoraEvent('*')
  async handleAllEvents(event: any) {
    console.log(`Received event: ${event.type}`);
  }
}
```

### Manual signature verification

```typescript
// webhooks.controller.ts
import { Controller, Post, Headers, Body, UseGuards } from '@nestjs/common';
import { ExoraWebhookGuard, ExoraRawBody } from '@exora/nestjs';

@Controller('webhooks')
export class WebhooksController {
  @Post('exora')
  @UseGuards(ExoraWebhookGuard)
  async handleWebhook(
    @ExoraRawBody() rawBody: Buffer,
    @Headers('exora-signature') signature: string,
    @Body() event: any,
  ) {
    // Webhook is already verified by the guard
    switch (event.type) {
      case 'payment.succeeded':
        await this.handlePaymentSucceeded(event.data);
        break;
      case 'refund.created':
        await this.handleRefundCreated(event.data);
        break;
    }

    return { received: true };
  }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | Required | Your Exora API key |
| `webhookSecret` | `string` | - | Webhook secret for signature verification |
| `baseUrl` | `string` | `https://api.exora.io` | API base URL |
| `timeout` | `number` | `30000` | Request timeout in ms |
| `maxRetries` | `number` | `3` | Max retry attempts |
| `debug` | `boolean` | `false` | Enable debug logging |

## Available Resources

The `ExoraService` provides access to all Exora API resources:

- `exora.payments` - Payment operations
- `exora.customers` - Customer management
- `exora.invoices` - Invoice operations
- `exora.webhooks` - Webhook endpoints
- `exora.apiKeys` - API key management

## Error Handling

```typescript
import { ExoraError, InvalidRequestError, NotFoundError } from '@exora/nestjs';

try {
  await this.exora.payments.retrieve('invalid_id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Payment not found');
  } else if (error instanceof InvalidRequestError) {
    console.log('Invalid request:', error.message);
  } else if (error instanceof ExoraError) {
    console.log('Exora error:', error.code, error.message);
  }
}
```

## License

MIT
