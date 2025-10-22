'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface FormSwitchProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function FormSwitch({ name, label, description, disabled }: FormSwitchProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            {label && <FormLabel className="text-base">{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
