'use client';

import { useLocale, useChangeLocale, LOCALES, LOCALE_LABELS, Locale } from '@/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const { changeLocale, isPending } = useChangeLocale();

  const handleChange = (value: string) => {
    changeLocale(value as Locale);
  };

  return (
    <Select
      value={currentLocale}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px] gap-2 h-9">
        <Languages className="h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
