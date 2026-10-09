import { getLocale, getTranslations } from 'next-intl/server';
import LoopController from '@/animations/LoopController';
import RevealObserver from '@/animations/RevealObserver';
import HeadScripts from '@/components/HeadScripts';
import { routing } from '@/i18n/routing';
import { fontVariables } from '@/lib/fonts';
import { localePath, OG_IMAGE_SIZE, SITE_URL } from '@/lib/site';
import '@/styles/globals.css';

// Only the locales listed in routing exist; anything else is a 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Per-locale <title>, description, canonical + hreflang alternates, Open Graph and
// Twitter Card. The og/twitter image comes from ./opengraph-image.js.
export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations('meta');
  // og:locale:alternate needs the other languages' codes (es_AR, en_US) from their own files.
  const otherLocales = await Promise.all(
    routing.locales
      .filter((l) => l !== locale)
      .map(async (l) => (await getTranslations({ locale: l, namespace: 'meta' }))('ogLocale')),
  );

  const title = t('title');
  const description = t('description');
  const url = localePath(locale);
  const image = { url: `${url}og.png`, ...OG_IMAGE_SIZE, alt: t('ogImageAlt') };

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l)])),
        // The root page picks a language for visitors who match neither.
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: (await getTranslations('nav'))('brand'),
      title,
      description,
      locale: t('ogLocale'),
      alternateLocale: otherLocales,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// [locale] is a root layout (there is no app/layout.js above it), so it owns <html>
// and can set the correct `lang` per language.
//
// There is no NextIntlClientProvider: Client Components get their texts as props from
// their Server Component parent. That keeps next-intl's runtime (and a JSON copy of the
// messages) out of the browser. See README → "Textos en un Client Component".
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
        {children}
        <RevealObserver />
        <LoopController />
      </body>
    </html>
  );
}
