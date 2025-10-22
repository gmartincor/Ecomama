'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface FormCheckboxProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function FormCheckbox({ name, label, description, disabled }: FormCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
