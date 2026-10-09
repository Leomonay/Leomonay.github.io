import { defineRouting } from 'next-intl/routing';

// Single source of truth for the supported locales. Everything else (static params,
// hreflang alternates, the root redirect script, the language switcher) derives from here.
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
});

// localStorage key shared by the language switcher and the root redirect script.
export const LOCALE_STORAGE_KEY = 'preferred-locale';
