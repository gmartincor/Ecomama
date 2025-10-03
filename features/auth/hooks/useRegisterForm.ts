import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

interface UseRegisterFormReturn {
  formData: RegisterInput;
  errors: Partial<Record<keyof RegisterInput, string>>;
  isLoading: boolean;
  serverError: string;
  handleChange: (field: keyof RegisterInput) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useRegisterForm(): UseRegisterFormReturn {
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

  return {
    formData,
    errors,
    isLoading,
    serverError,
    handleChange,
    handleSubmit,
  };
}
