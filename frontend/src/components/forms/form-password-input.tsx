'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput, type PasswordInputProps } from './password-input';

interface FormPasswordInputProps extends Omit<PasswordInputProps, 'name'> {
  name: string;
  label?: string;
}

export function FormPasswordInput({ name, label, ...props }: FormPasswordInputProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <PasswordInput {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
