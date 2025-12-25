'use client';

import { useTranslations } from 'next-intl';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/landing/footer';

export default function IntroductionPage() {
  const t = useTranslations('docs');

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
            <h1>{t('gettingStarted.introduction')}</h1>

            <p className="lead">
              Exora provides a complete payment infrastructure for internet businesses.
              Whether you're building a marketplace, SaaS platform, or e-commerce store,
              our APIs and tools make it easy to accept payments, manage subscriptions,
              and handle complex financial workflows.
            </p>

            <h2>Why Exora?</h2>
            <ul>
              <li><strong>Global Payments</strong> - Accept 135+ currencies and dozens of payment methods</li>
              <li><strong>Developer First</strong> - Clean APIs, comprehensive SDKs, and detailed documentation</li>
              <li><strong>Enterprise Ready</strong> - PCI DSS Level 1 certified with 99.99% uptime SLA</li>
              <li><strong>Real-time</strong> - Webhooks and events for instant payment notifications</li>
            </ul>

            <h2>Getting Started</h2>
            <p>
              Follow our quickstart guide to accept your first payment in minutes:
            </p>

            <ol>
              <li>Create an Exora account</li>
              <li>Get your API keys</li>
              <li>Install the SDK</li>
              <li>Make your first API call</li>
            </ol>

            <h2>Core Concepts</h2>

            <h3>Payments</h3>
            <p>
              A Payment represents a single charge to a customer. Payments can be created,
              confirmed, canceled, and refunded through our API.
            </p>

            <h3>Customers</h3>
            <p>
              Customers are the people or businesses who make purchases. Store customer
              information to enable faster checkouts and better analytics.
            </p>

            <h3>Invoices</h3>
            <p>
              Invoices let you bill customers for one-time or recurring charges.
              Send professional invoices with automatic payment reminders.
            </p>

            <h3>Webhooks</h3>
            <p>
              Webhooks notify your application when events happen in your Exora account.
              Use them to trigger business logic like fulfilling orders or updating your database.
            </p>

            <h2>Test Mode</h2>
            <p>
              All Exora accounts come with test mode enabled. Use test API keys to
              simulate payments without moving real money. When you're ready to go live,
              switch to your live API keys.
            </p>

            <div className="bg-primary/10 rounded-2xl p-6 my-8">
              <h4 className="text-primary mt-0">Test Card Numbers</h4>
              <ul className="mb-0">
                <li><code>4242 4242 4242 4242</code> - Successful payment</li>
                <li><code>4000 0000 0000 0002</code> - Card declined</li>
                <li><code>4000 0000 0000 9995</code> - Insufficient funds</li>
              </ul>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
