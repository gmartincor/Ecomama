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
    <div className="fixed top-4 right-4 z-50">
      <Select
        value={currentLocale}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px] gap-2">
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
    </div>
  );
}
