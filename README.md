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
- NextAuth.js for authentication
- TanStack Query for data fetching
- Tailwind CSS with custom glassmorphism effects
- Framer Motion for animations
- Radix UI components

### Backend (apps/api)
- NestJS 10
- Prisma ORM
- PostgreSQL
- Redis for caching
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
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker & Docker Compose

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/exora.git
cd exora

# Install dependencies
pnpm install
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL, Redis, and MailHog
docker-compose up -d

# Verify services are running
docker-compose ps
```

Services started:
- **PostgreSQL**: localhost:5432 (user: exora, password: exora_secret_2024)
- **Redis**: localhost:6379 (password: exora_redis_2024)
- **MailHog**: http://localhost:8025 (email testing UI)

### 3. Setup Database

```bash
# Generate Prisma client
pnpm --filter @exora/api db:generate

# Run migrations
pnpm --filter @exora/api db:migrate

# Seed with demo data
pnpm --filter @exora/api db:seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
pnpm dev
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Next.js frontend |
| API | http://localhost:4000 | NestJS backend |
| API Docs | http://localhost:4000/api/docs | Swagger documentation |
| MailHog | http://localhost:8025 | Email testing UI |
| Prisma Studio | Run `pnpm --filter @exora/api db:studio` | Database browser |

### Demo Credentials

After running the seed command:

```
Email: demo@exora.dev
Password: Demo@123456
```

## Development Commands

```bash
# Start all apps in development
pnpm dev

# Start specific app
pnpm --filter @exora/web dev
pnpm --filter @exora/api dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Database commands (run from root or apps/api)
pnpm --filter @exora/api db:generate  # Generate Prisma client
pnpm --filter @exora/api db:migrate   # Run migrations
pnpm --filter @exora/api db:seed      # Seed demo data
pnpm --filter @exora/api db:studio    # Open Prisma Studio
```

## Environment Variables

### Backend (apps/api/.env)

```env
# Server
PORT=4000
NODE_ENV=development
API_URL=http://localhost:4000

# Database (Docker)
DATABASE_URL="postgresql://exora:exora_secret_2024@localhost:5432/exora?schema=public"

# Redis (Docker)
REDIS_URL="redis://:exora_redis_2024@localhost:6379"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=http://localhost:3000
```

### Frontend (apps/web/.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
```

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

### URL-based Locales

- `/en/dashboard` - English
- `/ru/dashboard` - Russian
- `/fr/dashboard` - French

## API Endpoints

### Authentication
- `POST /auth/login` - Sign in
- `POST /auth/register` - Create account
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user

### Dashboard
- `GET /dashboard/overview` - Dashboard overview with stats
- `GET /dashboard/stats` - Statistics
- `GET /dashboard/recent-payments` - Recent payments

### Payments
- `POST /payments` - Create payment
- `GET /payments` - List payments
- `GET /payments/:id` - Get payment
- `POST /payments/:id/capture` - Capture payment
- `POST /payments/:id/refund` - Refund payment

### Customers
- `POST /customers` - Create customer
- `GET /customers` - List customers
- `GET /customers/:id` - Get customer
- `GET /customers/:id/payments` - Customer payments

### Invoices
- `POST /invoices` - Create invoice
- `GET /invoices` - List invoices
- `POST /invoices/:id/finalize` - Finalize invoice
- `POST /invoices/:id/pay` - Mark as paid

### Webhooks
- `POST /webhooks` - Create endpoint
- `GET /webhooks` - List endpoints
- `POST /webhooks/:id/test` - Test webhook

### API Keys
- `POST /api-keys` - Create API key
- `GET /api-keys` - List API keys
- `POST /api-keys/:id/revoke` - Revoke key

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Restart containers
docker-compose restart
```

### Port Conflicts

If ports are already in use:

```bash
# Check what's using port 5432
lsof -i :5432

# Stop conflicting services or change ports in docker-compose.yml
```

### Clean Start

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove node_modules
rm -rf node_modules apps/*/node_modules packages/*/node_modules

# Fresh install
pnpm install
docker-compose up -d
pnpm --filter @exora/api db:migrate
pnpm --filter @exora/api db:seed
```

## License

MIT License - see LICENSE file for details.

---

Built with ❤️ by the Exora Team
