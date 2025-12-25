'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { key: 'minLength', met: formData.password.length >= 8 },
    { key: 'hasUppercase', met: /[A-Z]/.test(formData.password) },
    { key: 'hasLowercase', met: /[a-z]/.test(formData.password) },
    { key: 'hasNumber', met: /\d/.test(formData.password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError(t('errors.passwordRequirements'));
      return;
    }

    if (!passwordsMatch) {
      setError(t('errors.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        companyName: formData.companyName || undefined,
      }, locale);

      // Auto login after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        router.push(`/${locale}/auth/login?registered=true`);
      } else {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('errors.unexpected'));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Link href={`/${locale}`} className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Exora
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">{t('register.title')}</CardTitle>
          <CardDescription className="text-center">
            {t('register.subtitle')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('fields.firstName')}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  disabled={loading}
                  placeholder={t('placeholders.firstName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('fields.lastName')}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  disabled={loading}
                  placeholder={t('placeholders.lastName')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('fields.email')} *</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">{t('fields.companyName')}</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                disabled={loading}
                placeholder={t('placeholders.companyName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('fields.password')} *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-1 mt-2">
                  {passwordRequirements.map((req) => (
                    <div key={req.key} className="flex items-center gap-2 text-xs">
                      <CheckCircle
                        className={`h-3 w-3 ${req.met ? 'text-green-500' : 'text-muted-foreground'}`}
                      />
                      <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                        {t(`password.${req.key}`)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('fields.confirmPassword')} *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500">{t('errors.passwordMismatch')}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isPasswordValid || !passwordsMatch}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('register.submit')}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              {t('register.hasAccount')}{' '}
              <Link href={`/${locale}/auth/login`} className="text-primary hover:underline">
                {t('register.signIn')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
