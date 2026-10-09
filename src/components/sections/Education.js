import { getTranslations } from 'next-intl/server';
import { BookIcon, CodeIcon, GraduationIcon } from '@/components/icons';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// Icons matched by `id` in education.items.
const ICONS = { fullstack: CodeIcon, teaching: BookIcon, engineering: GraduationIcon };

/** Education: three small cards (title, institution, date). One column on phones, three from md. */
export default async function Education() {
  const t = await getTranslations('education');
  const items = t.raw('items');

  return (
    <Section id={SECTIONS.education} title={t('title')}>
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map(({ id }, i) => (
          <Card
            key={id}
            as="li"
            size="sm"
            icon={ICONS[id]}
            title={t(`items.${i}.title`)}
            meta={
              <>
                <span className="block">{t(`items.${i}.institution`)}</span>
                <span className="block">{t(`items.${i}.date`)}</span>
              </>
            }
            data-reveal="fade-up"
            style={{ '--reveal-delay': `${i * 80}ms` }}
          />
        ))}
      </ul>
    </Section>
  );
}
