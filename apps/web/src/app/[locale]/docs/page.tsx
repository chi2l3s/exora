'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/landing/footer';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Book, Code, Zap, Terminal, Settings } from 'lucide-react';

export default function DocsPage() {
  const t = useTranslations('docs');

  const sections = [
    {
      title: t('gettingStarted.title'),
      icon: Zap,
      items: [
        { href: '/docs/introduction', label: t('gettingStarted.introduction') },
        { href: '/docs/quickstart', label: t('gettingStarted.quickstart') },
        { href: '/docs/installation', label: t('gettingStarted.installation') },
        { href: '/docs/authentication', label: t('gettingStarted.authentication') },
      ],
    },
    {
      title: t('guides.title'),
      icon: Book,
      items: [
        { href: '/docs/guides/accept-payments', label: t('guides.acceptPayments') },
        { href: '/docs/guides/subscriptions', label: t('guides.subscriptions') },
        { href: '/docs/guides/invoicing', label: t('guides.invoicing') },
        { href: '/docs/guides/webhooks', label: t('guides.webhooks') },
        { href: '/docs/guides/testing', label: t('guides.testing') },
      ],
    },
    {
      title: t('api.title'),
      icon: Code,
      items: [
        { href: '/docs/api/overview', label: t('api.overview') },
        { href: '/docs/api/authentication', label: t('api.authentication') },
        { href: '/docs/api/errors', label: t('api.errors') },
        { href: '/docs/api/pagination', label: t('api.pagination') },
        { href: '/docs/api/versioning', label: t('api.versioning') },
      ],
    },
    {
      title: t('sdks.title'),
      icon: Terminal,
      items: [
        { href: '/docs/sdks/nodejs', label: t('sdks.nodejs') },
        { href: '/docs/sdks/python', label: t('sdks.python') },
        { href: '/docs/sdks/ruby', label: t('sdks.ruby') },
        { href: '/docs/sdks/go', label: t('sdks.go') },
        { href: '/docs/sdks/php', label: t('sdks.php') },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">{t('title')}</h1>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search')}
                className="pl-12 h-14 text-lg rounded-2xl"
              />
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sections.map((section) => (
              <Card key={section.title} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Quick Start Code Example */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">{t('gettingStarted.quickstart')}</h2>
            <div className="glass-card p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-muted-foreground font-mono">Terminal</span>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code>
                  <span className="text-muted-foreground"># Install the SDK</span>
                  {'\n'}
                  <span className="text-green-500">npm install</span> exora-sdk
                  {'\n\n'}
                  <span className="text-muted-foreground"># Create a payment</span>
                  {'\n'}
                  <span className="text-purple-500">import</span>
                  <span className="text-foreground"> {'{'} Exora {'}'} </span>
                  <span className="text-purple-500">from</span>
                  <span className="text-green-500"> 'exora-sdk'</span>
                  {'\n\n'}
                  <span className="text-purple-500">const</span>
                  <span className="text-blue-500"> exora </span>
                  <span className="text-foreground">= </span>
                  <span className="text-purple-500">new</span>
                  <span className="text-yellow-500"> Exora</span>
                  <span className="text-foreground">(</span>
                  <span className="text-green-500">'sk_test_...'</span>
                  <span className="text-foreground">)</span>
                  {'\n\n'}
                  <span className="text-purple-500">const</span>
                  <span className="text-blue-500"> payment </span>
                  <span className="text-foreground">= </span>
                  <span className="text-purple-500">await</span>
                  <span className="text-foreground"> exora.payments.</span>
                  <span className="text-yellow-500">create</span>
                  <span className="text-foreground">({'{'}</span>
                  {'\n'}
                  <span className="text-foreground">  amount: </span>
                  <span className="text-orange-500">2000</span>
                  <span className="text-foreground">,</span>
                  {'\n'}
                  <span className="text-foreground">  currency: </span>
                  <span className="text-green-500">'usd'</span>
                  <span className="text-foreground">,</span>
                  {'\n'}
                  <span className="text-foreground">{'}'})</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
