import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

interface UseLoginFormReturn {
  formData: LoginInput;
  errors: Partial<Record<keyof LoginInput, string>>;
  isLoading: boolean;
  serverError: string;
  registered: boolean;
  handleChange: (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
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
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        const callbackUrl = searchParams.get('callbackUrl') || '/tablon';
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setServerError('Error de conexión. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  const registered = searchParams.get('registered') === 'true';

  return {
    formData,
    errors,
    isLoading,
    serverError,
    registered,
    handleChange,
    handleSubmit,
  };
}
