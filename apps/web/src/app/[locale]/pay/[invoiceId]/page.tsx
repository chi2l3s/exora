'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Lock, Check } from 'lucide-react';

interface PaymentPageProps {
  params: {
    invoiceId: string;
    locale: string;
  };
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const t = useTranslations('payment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock invoice data
  const invoice = {
    id: params.invoiceId,
    amount: 5000,
    currency: 'USD',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('success.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('success.description', { email: 'customer@email.com' })}
          </p>
          <Button variant="outline">{t('success.receipt')}</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5 p-4">
      <GlassCard className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
          <div className="text-3xl font-bold gradient-text">
            {formatCurrency(invoice.amount, invoice.currency)}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Information */}
          <div>
            <label className="text-sm font-medium block mb-2">{t('card.title')}</label>
            <div className="space-y-3">
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('card.number')}
                  className="pl-10"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input type="text" placeholder={t('card.expiry')} required />
                <Input type="text" placeholder={t('card.cvc')} required />
              </div>
              <Input type="text" placeholder={t('card.name')} required />
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <label className="text-sm font-medium block mb-2">{t('billing.title')}</label>
            <div className="space-y-3">
              <Input type="email" placeholder={t('billing.email')} required />
              <Input type="text" placeholder={t('billing.country')} required />
              <Input type="text" placeholder={t('billing.address')} required />
              <div className="grid grid-cols-2 gap-3">
                <Input type="text" placeholder={t('billing.city')} required />
                <Input type="text" placeholder={t('billing.postalCode')} required />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? t('processing') : t('button', { amount: formatCurrency(invoice.amount, invoice.currency) })}
          </Button>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>{t('secure')}</span>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
