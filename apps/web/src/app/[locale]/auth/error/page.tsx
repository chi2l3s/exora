'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: t('errors.configuration'),
    AccessDenied: t('errors.accessDenied'),
    Verification: t('errors.verification'),
    Default: t('errors.default'),
    CredentialsSignin: t('errors.invalidCredentials'),
  };

  const errorMessage = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-red-500/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{t('error.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('error.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg text-center">
            <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href={`/${locale}/auth/login`}>{t('error.tryAgain')}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/${locale}`}>{t('error.backHome')}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
