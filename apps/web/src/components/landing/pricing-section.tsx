'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Link } from '@/navigation';
import { Check } from 'lucide-react';

export function PricingSection() {
  const t = useTranslations('landing.pricing');

  const features = [
    'cards',
    'wallets',
    'support',
    'api',
    'webhooks',
    'analytics',
  ];

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground text-balance">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-lg mx-auto"
        >
          <GlassCard className="p-10 relative overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-50" />

            <div className="relative z-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-6xl font-bold gradient-text">2.9%</span>
                  <span className="text-2xl font-semibold text-muted-foreground">+ $0.30</span>
                </div>
                <p className="text-muted-foreground mt-2">{t('perTransaction')}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span>{t(`features.${feature}`)}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button size="lg" className="w-full" asChild>
                <Link href="/auth/signup">
                  {t('title').includes('Simple') ? 'Get Started' : 'Начать'}
                </Link>
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Volume discount note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Volume discounts available for enterprise customers.
        </motion.p>
      </div>
    </section>
  );
}
