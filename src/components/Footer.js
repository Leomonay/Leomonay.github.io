import { getTranslations } from 'next-intl/server';

// TODO(footer): final design; it could repeat the profile links.
export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="border-t border-base-300">
      <div className="container-page flex flex-col gap-1 py-8 text-sm text-base-content/75 sm:flex-row sm:justify-between">
        {/* The year is fixed at build time, which is fine for a site rebuilt on every deploy. */}
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <p>{t('builtWith')}</p>
      </div>
    </footer>
  );
}
