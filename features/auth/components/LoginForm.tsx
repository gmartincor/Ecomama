'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (field: keyof LoginInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginInput, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginInput;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError('Email o contraseña incorrectos');
        return;
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setServerError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const registered = searchParams.get('registered') === 'true';

  return (
    <div className="space-y-4">
      {registered && (
        <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
          ¡Cuenta creada! Ya puedes iniciar sesión.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={errors.password}
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>

        {serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
