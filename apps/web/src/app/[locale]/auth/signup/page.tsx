'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/card';

export default function SignUpPage() {
  const t = useTranslations('auth.signUp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-2xl">Exora</span>
          </Link>
        </div>

        <GlassCard className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">{t('name')}</label>
              <Input type="text" placeholder="John Doe" required />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">{t('email')}</label>
              <Input type="email" placeholder="name@company.com" required />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">{t('password')}</label>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">{t('confirmPassword')}</label>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="rounded border-input mt-1" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                {t('terms')}
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full">
              {t('button')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('hasAccount')} </span>
            <Link href="/auth/signin" className="text-primary font-medium hover:underline">
              {t('signIn')}
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
