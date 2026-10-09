import { getTranslations } from 'next-intl/server';
import { revealDelay } from '@/animations/reveal';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

/**
 * Earlier career: compact vertical timeline, most recent first (the order of the data).
 * One line per role, no disclosures. On phones the period sits above the role
 * instead of in its own column, so the list stays narrow and short.
 */
export default async function Career() {
  const t = await getTranslations('career');
  const items = t.raw('items');

  return (
    <Section id={SECTIONS.career} title={t('title')}>
      <ol className="rail max-w-3xl">
        {items.map((_, i) => (
          <li
            key={i}
            data-reveal="fade-up"
            style={revealDelay(i)}
            className="rail-item grid gap-x-6 gap-y-0.5 sm:grid-cols-[6.5rem_1fr]"
          >
            <p className="text-sm font-semibold text-primary tabular-nums sm:pt-0.5">
              {t(`items.${i}.period`)}
            </p>
            <div>
              <p className="font-semibold text-base-content">
                {t(`items.${i}.company`)}
                <span className="font-normal text-base-content/75"> · {t(`items.${i}.role`)}</span>
              </p>
              <p className="text-sm text-base-content/75">{t(`items.${i}.summary`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
