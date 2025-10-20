export const LOCALES = ['en', 'es'] as const;
export const DEFAULT_LOCALE = 'en' as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
} as const;

export const LOCALE_MAP: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES',
} as const;

export const isValidLocale = (locale: string): locale is Locale => 
  LOCALES.includes(locale as Locale);
