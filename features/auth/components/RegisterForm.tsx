'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterInput>({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (field: keyof RegisterInput) => (
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

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterInput, string>> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterInput;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Error al crear cuenta');
        return;
      }

      router.push('/login?registered=true');
    } catch (error) {
      setServerError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          disabled={isLoading}
          autoComplete="name"
        />
      </div>

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
          autoComplete="new-password"
        />
      </div>

      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Crear cuenta
      </Button>
    </form>
  );
}
