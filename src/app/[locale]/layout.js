import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '@/styles/globals.css';

// Only the locales listed in routing exist; anything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// [locale] is a root layout (there is no app/layout.js above it), so it owns <html>
// and can set the correct `lang` per language.
export default async function LocaleLayout({ children }) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
