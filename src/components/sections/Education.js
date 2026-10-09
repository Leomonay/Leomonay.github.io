import { getTranslations } from 'next-intl/server';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// TODO(education): visual design (cards or a compact list).
// Note: `institution` is optional (Industrial Engineering has none in the data).
export default async function Education() {
  const t = await getTranslations('education');
  const items = t.raw('items');

  return (
    <Section id={SECTIONS.education} title={t('title')}>
      <ul className="flex flex-col gap-4" data-reveal="fade-up">
        {items.map((item, i) => (
          <li key={i}>
            <p className="font-semibold">{t(`items.${i}.title`)}</p>
            <p className="text-base-content/75">
              {item.institution && <>{t(`items.${i}.institution`)} · </>}
              {t(`items.${i}.date`)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
