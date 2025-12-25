'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { Home } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('errors.notFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">{t('description')}</p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            {t('action')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
