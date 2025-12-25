'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HeroSection() {
  const t = useTranslations('landing.hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-pattern">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            <span className="block">{t('title').split(' ').slice(0, 2).join(' ')}</span>
            <span className="block gradient-text">{t('title').split(' ').slice(2).join(' ')}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="xl" className="group" asChild>
              <Link href="/auth/signup">
                {t('cta.primary')}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#contact">{t('cta.secondary')}</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t"
          >
            <StatItem value="$1B+" label={t('stats.transactions')} />
            <StatItem value="195+" label={t('stats.countries')} />
            <StatItem value="99.99%" label={t('stats.uptime')} />
            <StatItem value="50K+" label={t('stats.developers')} />
          </motion.div>
        </motion.div>

        {/* Code preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="glass-card p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-muted-foreground font-mono">payment.ts</span>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="language-typescript">
                <span className="text-purple-500">import</span>
                <span className="text-foreground"> {'{'} Exora {'}'} </span>
                <span className="text-purple-500">from</span>
                <span className="text-green-500"> 'exora-sdk'</span>
                <span className="text-foreground">;</span>
                {'\n\n'}
                <span className="text-purple-500">const</span>
                <span className="text-blue-500"> exora </span>
                <span className="text-foreground">= </span>
                <span className="text-purple-500">new</span>
                <span className="text-yellow-500"> Exora</span>
                <span className="text-foreground">(</span>
                <span className="text-green-500">'sk_live_...'</span>
                <span className="text-foreground">);</span>
                {'\n\n'}
                <span className="text-purple-500">const</span>
                <span className="text-blue-500"> payment </span>
                <span className="text-foreground">= </span>
                <span className="text-purple-500">await</span>
                <span className="text-foreground"> exora.</span>
                <span className="text-yellow-500">payments</span>
                <span className="text-foreground">.</span>
                <span className="text-yellow-500">create</span>
                <span className="text-foreground">({'{'}</span>
                {'\n'}
                <span className="text-foreground">  amount: </span>
                <span className="text-orange-500">5000</span>
                <span className="text-foreground">,</span>
                {'\n'}
                <span className="text-foreground">  currency: </span>
                <span className="text-green-500">'usd'</span>
                <span className="text-foreground">,</span>
                {'\n'}
                <span className="text-foreground">  customer: </span>
                <span className="text-green-500">'cus_...'</span>
                {'\n'}
                <span className="text-foreground">{'}'});</span>
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold gradient-text">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
