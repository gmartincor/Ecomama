'use client';

import { useLocale, useChangeLocale, LOCALES, LOCALE_LABELS, Locale } from '@/i18n';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const { changeLocale, isPending } = useChangeLocale();

  const handleChange = (value: string) => {
    changeLocale(value as Locale);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
        aria-label="Language selector"
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
