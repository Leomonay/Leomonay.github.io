import { getTranslations } from 'next-intl/server';
import { CodeIcon, FactoryIcon, MonitorIcon } from '@/components/icons';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// Icons for about.journey, matched by step `id`.
const STEP_ICONS = { industry: FactoryIcon, coding: CodeIcon, today: MonitorIcon };

/**
 * About: the story in prose (a comfortable ~65-character reading column) next to a
 * three-step path — industry → coding → today. Stacks on mobile, side by side from md.
 */
export default async function About() {
  const t = await getTranslations('about');
  const paragraphs = t.raw('paragraphs');
  const journey = t.raw('journey');

  return (
    <Section id={SECTIONS.about} title={t('title')}>
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex max-w-prose flex-col gap-5 text-lg leading-relaxed">
          {paragraphs.map((_, i) => (
            <p
              key={i}
              data-reveal="fade-up"
              style={{ '--reveal-delay': `${i * 80}ms` }}
              className={i === 0 ? 'text-base-content' : 'text-base-content/75'}
            >
              {t(`paragraphs.${i}`)}
            </p>
          ))}
        </div>

        <div data-reveal="fade-up" style={{ '--reveal-delay': '120ms' }}>
          <h3
            id="about-journey"
            className="mb-6 text-sm font-semibold tracking-wide text-primary uppercase"
          >
            {t('journeyTitle')}
          </h3>

          {/* ::before draws the line that joins the steps; each icon sits on top of it. */}
          <ol
            aria-labelledby="about-journey"
            className="relative flex flex-col gap-8 before:absolute before:top-5 before:bottom-5 before:left-5 before:w-px before:-translate-x-1/2 before:bg-base-300"
          >
            {journey.map(({ id, period }, i) => {
              const Icon = STEP_ICONS[id];
              const last = i === journey.length - 1;
              return (
                <li key={id} className="relative flex gap-4">
                  <span
                    aria-hidden="true"
                    className={`grid size-10 shrink-0 place-items-center rounded-full border ${
                      last
                        ? 'border-primary bg-primary text-primary-content'
                        : 'border-base-300 bg-base-100 text-primary'
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="flex flex-col pt-1.5">
                    <p className="font-display text-lg font-bold text-base-content">
                      {t(`journey.${i}.title`)}
                      {period && (
                        <span className="ml-2 font-sans text-sm font-medium text-base-content/75 tabular-nums">
                          {t(`journey.${i}.period`)}
                        </span>
                      )}
                    </p>
                    <p className="text-base-content/75">{t(`journey.${i}.text`)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
