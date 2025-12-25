'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/card';

export default function SignInPage() {
  const t = useTranslations('auth.signIn');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in
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
              <label className="text-sm font-medium block mb-2">{t('email')}</label>
              <Input type="email" placeholder="name@company.com" required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">{t('password')}</label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  {t('forgotPassword')}
                </Link>
              </div>
              <Input type="password" placeholder="••••••••" required />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-input" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                {t('rememberMe')}
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full">
              {t('button')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">{t('noAccount')} </span>
            <Link href="/auth/signup" className="text-primary font-medium hover:underline">
              {t('signUp')}
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
