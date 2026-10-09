import { getTranslations } from 'next-intl/server';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';
import ExperienceItem from './ExperienceItem';

/**
 * Experience — the reference section: every other section follows this pattern.
 *
 * 1. Content lives in messages/<locale>.json under `experience.items` (an array).
 * 2. `t.raw` reads the array only to know *what* to render (ids, optional fields).
 * 3. Each string is still rendered through `t` / `t.rich` with its path
 *    (`items.0.company`), so ICU formatting and rich tags like <link> work.
 */
export default async function ExperienceSection() {
  const t = await getTranslations('experience');
  const tCommon = await getTranslations('common');
  const items = t.raw('items');

  return (
    <Section id={SECTIONS.experience} title={t('title')}>
      <ol className="relative flex flex-col gap-6 sm:gap-8 sm:border-l sm:border-base-300 sm:pl-8">
        {items.map((item, index) => (
          <ExperienceItem
            key={item.id}
            item={item}
            index={index}
            t={t}
            newTabLabel={tCommon('opensInNewTab')}
          />
        ))}
      </ol>
    </Section>
  );
}
