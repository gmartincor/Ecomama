import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { LOCALES, DEFAULT_LOCALE } from './config';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);
