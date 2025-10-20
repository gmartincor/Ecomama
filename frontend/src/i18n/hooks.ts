'use client';

import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { Locale } from './config';
import { useRouter, usePathname } from './routing';

export const useLocale = (): Locale => {
  const params = useParams();
  return params.locale as Locale;
};

export const useChangeLocale = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (locale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  return { changeLocale, isPending };
};
