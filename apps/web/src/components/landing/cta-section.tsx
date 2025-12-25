'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const t = useTranslations('landing.cta');

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-3xl"
        animate={{
          y: [0, 50, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
        animate={{
          y: [0, -50, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 text-balance">
            {t('subtitle')}
          </p>
          <Button size="xl" variant="gradient" className="group" asChild>
            <Link href="/auth/signup">
              {t('button')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
