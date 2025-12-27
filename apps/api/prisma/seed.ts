import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomUUID, createHash } from 'crypto';

const prisma = new PrismaClient();

// Helper to generate payment-like IDs
function generateId(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 21; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${id}`;
}

// Helper to hash API key
function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seed for Exora...\n');

  // Clean existing data in correct order (respecting foreign keys)
  console.log('🧹 Cleaning existing data...');

  await prisma.webhookAttempt.deleteMany();
  await prisma.webhookEndpoint.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.balance.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.paymentToken.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.project.deleteMany();
  await prisma.session.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data\n');

  // Create admin user
  const adminPassword = await argon2.hash('Admin@123456');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@exora.io',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Created admin user: admin@exora.io / Admin@123456');

  // Create demo merchant
  const merchantPassword = await argon2.hash('Demo@123456');
  const demoMerchant = await prisma.merchant.create({
    data: {
      email: 'demo@exora.dev',
      passwordHash: merchantPassword,
      companyName: 'Exora Demo Store',
      legalName: 'Exora Demo LLC',
      inn: '7707083893',
      kpp: '773601001',
      phone: '+7 (495) 123-45-67',
      website: 'https://demo.exora.io',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      timezone: 'Europe/Moscow',
      currency: 'RUB',
      feePercent: 2.5,
      fixedFee: 0,
      dailyLimit: 10000000,
      monthlyLimit: 100000000,
      transactionLimit: 1000000,
      settings: {
        notifyEmail: true,
        notifyWebhook: true,
        theme: 'light',
      },
    },
  });
  console.log('✅ Created demo merchant: demo@exora.dev / Demo@123456');

  // Create second merchant for variety
  const secondMerchant = await prisma.merchant.create({
    data: {
      email: 'shop@example.com',
      passwordHash: merchantPassword,
      companyName: 'Example Shop',
      legalName: 'Example Shop Inc',
      phone: '+1 (555) 987-6543',
      website: 'https://example-shop.com',
      status: 'ACTIVE',
      verificationStatus: 'VERIFIED',
      timezone: 'America/New_York',
      currency: 'USD',
      feePercent: 2.9,
      fixedFee: 30,
    },
  });
  console.log('✅ Created second merchant: shop@example.com');

  // Create projects
  const mainProject = await prisma.project.create({
    data: {
      merchantId: demoMerchant.id,
      name: 'Main Store',
      description: 'Primary e-commerce store',
      website: 'https://store.exora.dev',
      isLive: true,
      logoUrl: 'https://exora.dev/logo.png',
      brandColor: '#6366f1',
      allowedMethods: ['CARD', 'SBP', 'YOOMONEY'],
    },
  });

  const testProject = await prisma.project.create({
    data: {
      merchantId: demoMerchant.id,
      name: 'Test Project',
      description: 'For testing integrations',
      isLive: false,
      allowedMethods: ['CARD'],
    },
  });
  console.log('✅ Created 2 projects');

  // Create API keys
  const liveApiKey = 'exora_live_' + randomUUID().replace(/-/g, '').slice(0, 32);
  const testApiKey = 'exora_test_' + randomUUID().replace(/-/g, '').slice(0, 32);

  await prisma.apiKey.create({
    data: {
      merchantId: demoMerchant.id,
      projectId: mainProject.id,
      name: 'Live API Key',
      keyHash: hashApiKey(liveApiKey),
      keyPrefix: liveApiKey.slice(0, 20),
      type: 'LIVE',
      permissions: ['payments:read', 'payments:write', 'refunds:read', 'refunds:write', 'customers:read', 'customers:write'],
      rateLimit: 1000,
      isActive: true,
    },
  });

  await prisma.apiKey.create({
    data: {
      merchantId: demoMerchant.id,
      projectId: testProject.id,
      name: 'Test API Key',
      keyHash: hashApiKey(testApiKey),
      keyPrefix: testApiKey.slice(0, 20),
      type: 'TEST',
      permissions: ['payments:read', 'payments:write', 'refunds:read', 'refunds:write'],
      rateLimit: 100,
      isActive: true,
    },
  });
  console.log('✅ Created API keys');
  console.log(`   Live: ${liveApiKey}`);
  console.log(`   Test: ${testApiKey}`);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        merchantId: demoMerchant.id,
        email: 'ivan.petrov@mail.ru',
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        metadata: { tier: 'premium', source: 'website' },
      },
    }),
    prisma.customer.create({
      data: {
        merchantId: demoMerchant.id,
        email: 'maria.sidorova@gmail.com',
        name: 'Мария Сидорова',
        phone: '+7 (999) 234-56-78',
        metadata: { tier: 'standard', source: 'mobile' },
      },
    }),
    prisma.customer.create({
      data: {
        merchantId: demoMerchant.id,
        email: 'alex.volkov@yandex.ru',
        name: 'Александр Волков',
        phone: '+7 (999) 345-67-89',
        metadata: { tier: 'enterprise', source: 'sales' },
      },
    }),
    prisma.customer.create({
      data: {
        merchantId: demoMerchant.id,
        email: 'olga.kuznetsova@outlook.com',
        name: 'Ольга Кузнецова',
        metadata: { tier: 'standard', source: 'referral' },
      },
    }),
    prisma.customer.create({
      data: {
        merchantId: demoMerchant.id,
        email: 'dmitry.novikov@proton.me',
        name: 'Дмитрий Новиков',
        phone: '+7 (999) 456-78-90',
        metadata: { tier: 'premium', source: 'website' },
      },
    }),
  ]);
  console.log('✅ Created 5 customers');

  // Create subscription plans
  const plans = await Promise.all([
    prisma.subscriptionPlan.create({
      data: {
        merchantId: demoMerchant.id,
        name: 'Базовый',
        description: 'Базовый тариф для начинающих',
        amount: 99900, // 999 RUB
        currency: 'RUB',
        interval: 'MONTH',
        intervalCount: 1,
        trialDays: 7,
        isActive: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        merchantId: demoMerchant.id,
        name: 'Профессиональный',
        description: 'Для растущего бизнеса',
        amount: 299900, // 2999 RUB
        currency: 'RUB',
        interval: 'MONTH',
        intervalCount: 1,
        trialDays: 14,
        isActive: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        merchantId: demoMerchant.id,
        name: 'Корпоративный',
        description: 'Полный доступ для предприятий',
        amount: 999900, // 9999 RUB
        currency: 'RUB',
        interval: 'MONTH',
        intervalCount: 1,
        trialDays: 30,
        isActive: true,
      },
    }),
    prisma.subscriptionPlan.create({
      data: {
        merchantId: demoMerchant.id,
        name: 'Годовой Про',
        description: 'Профессиональный тариф на год (2 месяца бесплатно)',
        amount: 2999000, // 29990 RUB
        currency: 'RUB',
        interval: 'YEAR',
        intervalCount: 1,
        trialDays: 14,
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Created 4 subscription plans');

  // Create transactions (payments)
  type PaymentStatusType = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  type PaymentMethodType = 'CARD' | 'SBP' | 'YOOMONEY';

  const paymentStatuses: PaymentStatusType[] = ['SUCCEEDED', 'SUCCEEDED', 'SUCCEEDED', 'PENDING', 'FAILED', 'SUCCEEDED', 'SUCCEEDED', 'PROCESSING', 'SUCCEEDED', 'PARTIALLY_REFUNDED'];
  const paymentMethods: PaymentMethodType[] = ['CARD', 'SBP', 'YOOMONEY'];
  const cardBrands = ['visa', 'mastercard', 'mir'];

  const transactions = await Promise.all(
    Array.from({ length: 30 }, async (_, i) => {
      const customer = customers[i % customers.length];
      const status = paymentStatuses[i % paymentStatuses.length];
      const method = paymentMethods[i % paymentMethods.length];
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const amount = Math.floor(Math.random() * 500000) + 5000;
      const feeAmount = Math.round(amount * 0.025);

      return prisma.transaction.create({
        data: {
          id: generateId('pay'),
          merchantId: demoMerchant.id,
          projectId: mainProject.id,
          orderId: `order_${String(1000 + i).padStart(6, '0')}`,
          amount,
          currency: 'RUB',
          amountRefunded: status === 'PARTIALLY_REFUNDED' ? Math.floor(amount * 0.3) : status === 'REFUNDED' ? amount : 0,
          feeAmount: status === 'SUCCEEDED' || status === 'PARTIALLY_REFUNDED' ? feeAmount : 0,
          netAmount: status === 'SUCCEEDED' || status === 'PARTIALLY_REFUNDED' ? amount - feeAmount : 0,
          status,
          paymentMethod: method,
          description: `Заказ #${1000 + i}`,
          metadata: { orderId: `order_${1000 + i}`, source: 'website' },
          customerEmail: customer.email,
          customerName: customer.name,
          customerId: customer.id,
          cardBrand: method === 'CARD' ? cardBrands[i % 3] : null,
          cardLast4: method === 'CARD' ? String(1000 + (i * 111) % 9000) : null,
          cardExpMonth: method === 'CARD' ? ((i % 12) + 1) : null,
          cardExpYear: method === 'CARD' ? 2026 + (i % 3) : null,
          ipAddress: `192.168.${i % 256}.${(i * 7) % 256}`,
          country: 'RU',
          city: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'][i % 5],
          threeDSecureStatus: method === 'CARD' ? 'authenticated' : null,
          failureCode: status === 'FAILED' ? 'card_declined' : null,
          failureMessage: status === 'FAILED' ? 'Карта отклонена банком' : null,
          returnUrl: 'https://demo.exora.dev/success',
          cancelUrl: 'https://demo.exora.dev/cancel',
          paidAt: ['SUCCEEDED', 'PARTIALLY_REFUNDED', 'REFUNDED'].includes(status) ? createdAt : null,
          refundedAt: ['REFUNDED', 'PARTIALLY_REFUNDED'].includes(status) ? new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
          createdAt,
          updatedAt: createdAt,
        },
      });
    })
  );
  console.log('✅ Created 30 transactions');

  // Create refunds for some transactions
  const refundableTransactions = transactions.filter(t => t.status === 'PARTIALLY_REFUNDED' || t.status === 'REFUNDED');
  await Promise.all(
    refundableTransactions.map((transaction, i) => {
      const isPartial = transaction.status === 'PARTIALLY_REFUNDED';
      return prisma.refund.create({
        data: {
          merchantId: demoMerchant.id,
          transactionId: transaction.id,
          amount: isPartial ? Math.floor(transaction.amount * 0.3) : transaction.amount,
          reason: 'REQUESTED_BY_CUSTOMER',
          description: isPartial ? 'Частичный возврат по запросу клиента' : 'Полный возврат',
          status: 'SUCCEEDED',
          processedAt: new Date(),
        },
      });
    })
  );
  console.log(`✅ Created ${refundableTransactions.length} refunds`);

  // Create subscriptions
  await Promise.all([
    prisma.subscription.create({
      data: {
        merchantId: demoMerchant.id,
        customerId: customers[0].id,
        customerEmail: customers[0].email,
        planId: plans[1].id,
        amount: plans[1].amount,
        currency: 'RUB',
        status: 'ACTIVE',
        currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        metadata: {},
      },
    }),
    prisma.subscription.create({
      data: {
        merchantId: demoMerchant.id,
        customerId: customers[2].id,
        customerEmail: customers[2].email,
        planId: plans[2].id,
        amount: plans[2].amount,
        currency: 'RUB',
        status: 'ACTIVE',
        currentPeriodStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        currentPeriodEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        metadata: {},
      },
    }),
    prisma.subscription.create({
      data: {
        merchantId: demoMerchant.id,
        customerId: customers[1].id,
        customerEmail: customers[1].email,
        planId: plans[0].id,
        amount: plans[0].amount,
        currency: 'RUB',
        status: 'TRIALING',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        trialStart: new Date(),
        trialEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        metadata: {},
      },
    }),
    prisma.subscription.create({
      data: {
        merchantId: demoMerchant.id,
        customerId: customers[3].id,
        customerEmail: customers[3].email,
        planId: plans[1].id,
        amount: plans[1].amount,
        currency: 'RUB',
        status: 'CANCELLED',
        currentPeriodStart: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        currentPeriodEnd: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        cancelledAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        endedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        metadata: {},
      },
    }),
  ]);
  console.log('✅ Created 4 subscriptions');

  // Create balances
  await prisma.balance.create({
    data: {
      merchantId: demoMerchant.id,
      currency: 'RUB',
      available: 1234567,
      pending: 234567,
      reserved: 50000,
    },
  });

  await prisma.balance.create({
    data: {
      merchantId: secondMerchant.id,
      currency: 'USD',
      available: 5678,
      pending: 1234,
      reserved: 0,
    },
  });
  console.log('✅ Created balances');

  // Create payouts
  await Promise.all([
    prisma.payout.create({
      data: {
        merchantId: demoMerchant.id,
        amount: 500000,
        currency: 'RUB',
        feeAmount: 5000,
        netAmount: 495000,
        status: 'SUCCEEDED',
        bankAccount: '40817810099910004312',
        bankName: 'Сбербанк',
        bik: '044525225',
        description: 'Выплата за октябрь 2024',
        processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.payout.create({
      data: {
        merchantId: demoMerchant.id,
        amount: 300000,
        currency: 'RUB',
        feeAmount: 3000,
        netAmount: 297000,
        status: 'PENDING',
        bankAccount: '40817810099910004312',
        bankName: 'Сбербанк',
        bik: '044525225',
        description: 'Выплата за ноябрь 2024',
      },
    }),
  ]);
  console.log('✅ Created 2 payouts');

  // Create webhook endpoints
  const webhookEndpoint = await prisma.webhookEndpoint.create({
    data: {
      merchantId: demoMerchant.id,
      url: 'https://webhook.site/demo-exora',
      secret: 'whsec_' + randomUUID().replace(/-/g, ''),
      events: ['payment.succeeded', 'payment.failed', 'refund.created', 'subscription.created', 'subscription.cancelled'],
      isActive: true,
      successCount: 145,
      failureCount: 3,
      lastSuccessAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  });
  console.log('✅ Created webhook endpoint');

  // Create webhook attempts
  await Promise.all(
    Array.from({ length: 10 }, (_, i) => {
      const daysAgo = Math.floor(i / 3);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - i * 60 * 60 * 1000);
      const events = ['payment.succeeded', 'payment.failed', 'refund.created'];
      const statuses: Array<'SUCCESS' | 'FAILED'> = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED'];

      return prisma.webhookAttempt.create({
        data: {
          endpointId: webhookEndpoint.id,
          transactionId: transactions[i % transactions.length].id,
          event: events[i % 3],
          payload: {
            id: generateId('evt'),
            type: events[i % 3],
            data: { id: transactions[i % transactions.length].id, amount: transactions[i % transactions.length].amount },
            createdAt: createdAt.toISOString(),
            livemode: true,
          },
          status: statuses[i % 5],
          statusCode: statuses[i % 5] === 'SUCCESS' ? 200 : 500,
          responseBody: statuses[i % 5] === 'SUCCESS' ? '{"received": true}' : 'Internal Server Error',
          attemptNumber: statuses[i % 5] === 'SUCCESS' ? 1 : 3,
          createdAt,
        },
      });
    })
  );
  console.log('✅ Created 10 webhook attempts');

  // Create invoices
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => {
      const customer = customers[i % customers.length];
      const statuses: Array<'DRAFT' | 'OPEN' | 'PAID' | 'VOID'> = ['PAID', 'PAID', 'OPEN', 'DRAFT', 'VOID'];
      const status = statuses[i];
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const dueDate = new Date(createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
      const subtotal = (i + 1) * 50000;
      const tax = Math.floor(subtotal * 0.2);
      const total = subtotal + tax;

      return prisma.invoice.create({
        data: {
          merchantId: demoMerchant.id,
          customerId: customer.id,
          number: `INV-2024-${String(i + 1).padStart(4, '0')}`,
          status,
          currency: 'RUB',
          subtotal,
          tax,
          total,
          amountPaid: status === 'PAID' ? total : 0,
          amountDue: status === 'PAID' ? 0 : total,
          dueDate,
          paidAt: status === 'PAID' ? new Date(dueDate.getTime() - 3 * 24 * 60 * 60 * 1000) : null,
          createdAt,
          updatedAt: createdAt,
          items: {
            create: [
              {
                description: 'Услуги разработки',
                quantity: i + 1,
                unitPrice: 30000,
                amount: (i + 1) * 30000,
              },
              {
                description: 'Техническая поддержка',
                quantity: 1,
                unitPrice: subtotal - (i + 1) * 30000,
                amount: subtotal - (i + 1) * 30000,
              },
            ],
          },
        },
      });
    })
  );
  console.log('✅ Created 5 invoices');

  // Create audit logs
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => {
      const actions = ['login', 'create_payment', 'create_refund', 'update_settings', 'create_api_key'];
      const resources = ['session', 'transaction', 'refund', 'merchant', 'api_key'];

      return prisma.auditLog.create({
        data: {
          merchantId: demoMerchant.id,
          userType: 'MERCHANT',
          action: actions[i],
          resource: resources[i],
          resourceId: generateId(resources[i].slice(0, 3)),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
        },
      });
    })
  );
  console.log('✅ Created 5 audit logs');

  console.log('\n🎉 Database seed completed successfully!\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  📋 Demo Credentials');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Admin Panel:');
  console.log('    Email:    admin@exora.io');
  console.log('    Password: Admin@123456');
  console.log('');
  console.log('  Merchant Dashboard:');
  console.log('    Email:    demo@exora.dev');
  console.log('    Password: Demo@123456');
  console.log('');
  console.log('  🔑 API Keys:');
  console.log(`    Live: ${liveApiKey}`);
  console.log(`    Test: ${testApiKey}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
