import { getTranslations } from 'next-intl/server';
import Button from '@/components/ui/Button';
import { routing } from '@/i18n/routing';
import { localePath, SITE_URL } from '@/lib/site';

export async function generateMetadata() {
  // The name reads the same in every language, so it's taken from the default locale.
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: 'nav' });
  return {
    metadataBase: new URL(SITE_URL),
    title: t('brand'),
    alternates: {
      canonical: '/',
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l)])),
        'x-default': '/',
      },
    },
  };
}

// No-JS fallback: the inline script in the layout redirects before this renders.
// Each link is labelled in its own language (and marked with `lang`/`hreflang`),
// so the text comes from that locale's messages file.
export default async function RootPage() {
  const links = await Promise.all(
    routing.locales.map(async (locale) => {
      const t = await getTranslations({ locale, namespace: 'root' });
      return { locale, label: t('linkLabel') };
    }),
  );

  const brand = (await getTranslations({ locale: routing.defaultLocale, namespace: 'nav' }))(
    'brand',
  );

  return (
    <main className="grid min-h-dvh place-items-center content-center gap-8 p-6">
      <h1 className="text-3xl font-bold">{brand}</h1>
      <ul className="flex flex-col gap-4 text-center sm:flex-row">
        {links.map(({ locale, label }) => (
          <li key={locale}>
            <Button href={localePath(locale)} hrefLang={locale} lang={locale}>
              {label}
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
