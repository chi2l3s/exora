import { PrismaClient, PaymentStatus, InvoiceStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.webhookDelivery.deleteMany();
  await prisma.webhookEndpoint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo@123456', 10);

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@exora.dev',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      companyName: 'Exora Demo',
      role: 'admin',
      isVerified: true,
    },
  });

  console.log('✅ Created demo user: demo@exora.dev / Demo@123456');

  // Create API keys
  const liveApiKey = await prisma.apiKey.create({
    data: {
      userId: demoUser.id,
      name: 'Live API Key',
      keyHash: await bcrypt.hash('sk_live_demo_key_123456789', 10),
      keyPrefix: 'sk_live_demo',
      isActive: true,
      permissions: ['payments:read', 'payments:write', 'customers:read', 'customers:write', 'invoices:read', 'invoices:write'],
    },
  });

  const testApiKey = await prisma.apiKey.create({
    data: {
      userId: demoUser.id,
      name: 'Test API Key',
      keyHash: await bcrypt.hash('sk_test_demo_key_987654321', 10),
      keyPrefix: 'sk_test_demo',
      isActive: true,
      permissions: ['payments:read', 'payments:write', 'customers:read', 'customers:write', 'invoices:read', 'invoices:write'],
    },
  });

  console.log('✅ Created API keys');

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+1-555-123-4567',
        externalId: 'cust_001',
        metadata: { tier: 'premium', source: 'website' },
      },
    }),
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        phone: '+1-555-987-6543',
        externalId: 'cust_002',
        metadata: { tier: 'standard', source: 'mobile_app' },
      },
    }),
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        email: 'bob.wilson@company.com',
        name: 'Bob Wilson',
        phone: '+1-555-456-7890',
        externalId: 'cust_003',
        metadata: { tier: 'enterprise', source: 'sales' },
      },
    }),
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        email: 'alice.johnson@startup.io',
        name: 'Alice Johnson',
        externalId: 'cust_004',
        metadata: { tier: 'standard', source: 'referral' },
      },
    }),
    prisma.customer.create({
      data: {
        userId: demoUser.id,
        email: 'charlie.brown@tech.co',
        name: 'Charlie Brown',
        externalId: 'cust_005',
        metadata: { tier: 'premium', source: 'website' },
      },
    }),
  ]);

  console.log('✅ Created 5 customers');

  // Create payments
  const paymentStatuses: PaymentStatus[] = ['succeeded', 'succeeded', 'succeeded', 'pending', 'failed', 'succeeded', 'succeeded', 'processing', 'succeeded', 'refunded'];
  const currencies = ['USD', 'EUR', 'GBP'];
  const methods = ['card', 'bank_transfer', 'wallet'];

  const payments = await Promise.all(
    Array.from({ length: 25 }, async (_, i) => {
      const customer = customers[i % customers.length];
      const status = paymentStatuses[i % paymentStatuses.length];
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      return prisma.payment.create({
        data: {
          userId: demoUser.id,
          customerId: customer.id,
          amount: Math.floor(Math.random() * 500000) + 1000, // $10.00 to $5000.00 in cents
          currency: currencies[i % currencies.length],
          status,
          method: methods[i % methods.length] as any,
          description: `Payment #${1000 + i}`,
          metadata: { orderId: `order_${1000 + i}` },
          paidAt: status === 'succeeded' ? createdAt : null,
          refundedAmount: status === 'refunded' ? Math.floor(Math.random() * 10000) + 1000 : 0,
          createdAt,
          updatedAt: createdAt,
        },
      });
    })
  );

  console.log('✅ Created 25 payments');

  // Create invoices
  const invoiceStatuses: InvoiceStatus[] = ['paid', 'paid', 'open', 'draft', 'void'];

  const invoices = await Promise.all(
    Array.from({ length: 10 }, async (_, i) => {
      const customer = customers[i % customers.length];
      const status = invoiceStatuses[i % invoiceStatuses.length];
      const daysAgo = Math.floor(Math.random() * 60);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
      const dueDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);

      const subtotal = Math.floor(Math.random() * 1000000) + 10000;
      const tax = Math.floor(subtotal * 0.1);
      const total = subtotal + tax;

      return prisma.invoice.create({
        data: {
          userId: demoUser.id,
          customerId: customer.id,
          number: `INV-2024-${String(i + 1).padStart(4, '0')}`,
          status,
          currency: currencies[i % currencies.length],
          subtotal,
          tax,
          total,
          amountPaid: status === 'paid' ? total : 0,
          amountDue: status === 'paid' ? 0 : total,
          dueDate,
          paidAt: status === 'paid' ? new Date(dueDate.getTime() - 5 * 24 * 60 * 60 * 1000) : null,
          metadata: {},
          createdAt,
          updatedAt: createdAt,
          items: {
            create: [
              {
                description: 'Professional Services',
                quantity: Math.floor(Math.random() * 10) + 1,
                unitPrice: Math.floor(subtotal * 0.6 / (Math.floor(Math.random() * 10) + 1)),
                amount: Math.floor(subtotal * 0.6),
              },
              {
                description: 'Platform Fee',
                quantity: 1,
                unitPrice: Math.floor(subtotal * 0.4),
                amount: Math.floor(subtotal * 0.4),
              },
            ],
          },
        },
      });
    })
  );

  console.log('✅ Created 10 invoices');

  // Create webhook endpoints
  const webhookEndpoint = await prisma.webhookEndpoint.create({
    data: {
      userId: demoUser.id,
      url: 'https://webhook.site/demo-endpoint',
      events: ['payment.succeeded', 'payment.failed', 'invoice.paid', 'customer.created'],
      isActive: true,
      secret: 'whsec_demo_secret_key_123456',
      description: 'Demo webhook endpoint',
    },
  });

  console.log('✅ Created webhook endpoint');

  // Create webhook deliveries
  await Promise.all(
    Array.from({ length: 5 }, async (_, i) => {
      const daysAgo = Math.floor(Math.random() * 7);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      return prisma.webhookDelivery.create({
        data: {
          endpointId: webhookEndpoint.id,
          eventType: ['payment.succeeded', 'payment.failed', 'invoice.paid'][i % 3],
          payload: {
            id: `evt_${Date.now()}_${i}`,
            type: ['payment.succeeded', 'payment.failed', 'invoice.paid'][i % 3],
            data: { object: { id: `pay_${i}`, amount: 10000 } },
          },
          responseStatus: i < 4 ? 200 : 500,
          responseBody: i < 4 ? '{"received": true}' : 'Internal Server Error',
          attempts: i < 4 ? 1 : 3,
          status: i < 4 ? 'success' : 'failed',
          createdAt,
        },
      });
    })
  );

  console.log('✅ Created webhook deliveries');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email: demo@exora.dev');
  console.log('   Password: Demo@123456');
  console.log('\n🔑 API Keys (prefix):');
  console.log('   Live: sk_live_demo...');
  console.log('   Test: sk_test_demo...');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
