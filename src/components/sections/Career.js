import { getTranslations } from 'next-intl/server';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// Earlier career: one line per role, no disclosures (per spec).
// TODO(career): visual design — a compact list or table-like layout that reads well
//   on phones (company/role/period on one line, summary below).
export default async function Career() {
  const t = await getTranslations('career');
  const items = t.raw('items');

  return (
    <Section id={SECTIONS.career} title={t('title')}>
      <ol className="flex flex-col gap-4" data-reveal="fade-up">
        {items.map((_, i) => (
          <li key={i}>
            <p className="font-semibold">
              {t(`items.${i}.company`)} · {t(`items.${i}.role`)} · {t(`items.${i}.period`)}
            </p>
            <p className="text-base-content/75">{t(`items.${i}.summary`)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
