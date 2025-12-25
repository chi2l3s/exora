# Exora Payment Platform

A production-ready payment platform built with modern technologies, featuring multi-language support for 10 languages, Apple-style UI/UX, and comprehensive developer tools.

## Features

- **Multi-language Support**: 10 languages (EN, RU, ES, FR, DE, IT, PT, ZH, JA, KO)
- **Apple-style Design**: Glassmorphism, smooth animations, and beautiful typography
- **Full-stack TypeScript**: Type-safe from frontend to backend
- **Payment Processing**: Complete payment lifecycle management
- **SDK**: Official Node.js SDK with NestJS module support
- **Dashboard**: Comprehensive admin interface
- **Documentation**: Developer-friendly docs

## Tech Stack

### Frontend (apps/web)
- Next.js 14 with App Router
- next-intl for internationalization
- Tailwind CSS with custom glassmorphism effects
- Framer Motion for animations
- Radix UI components

### Backend (apps/api)
- NestJS 10
- Prisma ORM
- PostgreSQL
- nestjs-i18n for backend localization
- JWT authentication

### SDK (packages/exora-sdk)
- TypeScript
- Full API type definitions
- NestJS module integration
- Localized error messages

### UI Library (packages/ui)
- Reusable React components
- Built on Radix UI primitives
- Tailwind CSS styling

## Project Structure

```
exora/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── exora-sdk/    # Official SDK
│   └── ui/           # UI component library
├── turbo.json        # Turborepo config
└── pnpm-workspace.yaml
```

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/exora.git
cd exora

# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env

# Run database migrations
pnpm --filter @exora/api prisma migrate dev

# Start development servers
pnpm dev
```

### Access Points

- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs

## SDK Usage

```typescript
import { Exora } from 'exora-sdk';

const exora = new Exora({
  apiKey: 'sk_test_...',
  locale: 'en', // Optional: localized error messages
});

// Create a payment
const payment = await exora.payments.create({
  amount: 5000,
  currency: 'usd',
  description: 'Order #1234',
});

// List payments
const { data, pagination } = await exora.payments.list({
  limit: 10,
  status: 'succeeded',
});
```

### NestJS Integration

```typescript
import { Module } from '@nestjs/common';
import { ExoraModule } from 'exora-sdk';

@Module({
  imports: [
    ExoraModule.forRoot({
      apiKey: process.env.EXORA_API_KEY,
      locale: 'en',
    }),
  ],
})
export class AppModule {}
```

## Internationalization

The platform supports 10 languages:

| Code | Language | Flag |
|------|----------|------|
| en | English | 🇬🇧 |
| ru | Русский | 🇷🇺 |
| es | Español | 🇪🇸 |
| fr | Français | 🇫🇷 |
| de | Deutsch | 🇩🇪 |
| it | Italiano | 🇮🇹 |
| pt | Português | 🇵🇹 |
| zh | 中文 | 🇨🇳 |
| ja | 日本語 | 🇯🇵 |
| ko | 한국어 | 🇰🇷 |

### Frontend i18n

Uses next-intl with URL-based locales:
- `/en` - English
- `/ru` - Russian
- `/fr` - French

### Backend i18n

Uses nestjs-i18n with Accept-Language header detection.

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/signin` - Sign in
- `POST /api/v1/auth/refresh` - Refresh token

### Payments
- `POST /api/v1/payments` - Create payment
- `GET /api/v1/payments` - List payments
- `GET /api/v1/payments/:id` - Get payment
- `POST /api/v1/payments/:id/confirm` - Confirm payment
- `POST /api/v1/payments/:id/refund` - Refund payment

### Invoices
- `POST /api/v1/invoices` - Create invoice
- `GET /api/v1/invoices` - List invoices
- `POST /api/v1/invoices/:id/send` - Send invoice

### Webhooks
- `POST /api/v1/webhooks` - Create endpoint
- `GET /api/v1/webhooks` - List endpoints

## Development

```bash
# Run all apps in development
pnpm dev

# Run specific app
pnpm web dev
pnpm api dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ by the Exora Team
