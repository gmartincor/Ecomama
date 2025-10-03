'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useLoginForm } from '../hooks/useLoginForm';

export function LoginForm() {
  const {
    formData,
    errors,
    isLoading,
    serverError,
    registered,
    handleChange,
    handleSubmit,
  } = useLoginForm();

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
