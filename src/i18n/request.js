import { notFound } from 'next/navigation';
import * as rootParams from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Resolves the locale for every server-side next-intl call.
// `next/root-params` reads the [locale] segment of the root layout at build time, which
// keeps every page statically renderable without the deprecated `setRequestLocale`.
export default getRequestConfig(async ({ locale }) => {
  // An explicit locale (e.g. `getTranslations({ locale })`) wins. The root redirect page
  // and the global 404 live outside [locale] and rely on this.
  if (!locale) {
    const param = await rootParams.locale();
    if (!hasLocale(routing.locales, param)) notFound();
    locale = param;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
