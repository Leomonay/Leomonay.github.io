import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import HeadScripts from '@/components/HeadScripts';
import { routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
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
    // suppressHydrationWarning: the inline theme script sets `data-theme` on <html> before
    // React hydrates, so the server HTML (no data-theme) and the DOM legitimately differ.
    // The flag only silences attribute mismatches on this one element, not its children.
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <HeadScripts />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
