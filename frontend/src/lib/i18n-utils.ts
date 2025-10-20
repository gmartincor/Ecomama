import { Locale, LOCALE_MAP } from '@/i18n';

export interface FormatDateOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
}

export interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatDate(
  date: Date | string,
  locale: Locale,
  options: FormatDateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(LOCALE_MAP[locale], options).format(dateObj);
}

export function formatCurrency(
  amount: number,
  currency: string,
  locale: Locale,
  options?: FormatCurrencyOptions
): string {
  return new Intl.NumberFormat(LOCALE_MAP[locale], {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

export function formatNumber(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_MAP[locale]).format(amount);
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: Locale
): string {
  return new Intl.RelativeTimeFormat(LOCALE_MAP[locale], { 
    numeric: 'auto' 
  }).format(value, unit);
}
