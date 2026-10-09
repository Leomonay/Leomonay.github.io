import { getTranslations } from 'next-intl/server';
import Button from '@/components/ui/Button';
import { routing } from '@/i18n/routing';
import { localePath, SITE_URL } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l)])),
      'x-default': '/',
    },
  },
};

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

  return (
    <main className="grid min-h-dvh place-items-center p-6">
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
