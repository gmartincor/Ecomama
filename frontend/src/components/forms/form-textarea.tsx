'use client';

import { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface FormTextareaProps extends Omit<ComponentProps<typeof Textarea>, 'name'> {
  name: string;
  label?: string;
}

export function FormTextarea({ name, label, ...props }: FormTextareaProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
