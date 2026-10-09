import { getTranslations } from 'next-intl/server';
import {
  ArrowRightIcon,
  ChartIcon,
  CheckIcon,
  ClipboardIcon,
  CloseIcon,
  HistoryIcon,
  ImageIcon,
  KeyIcon,
  PencilIcon,
  QuoteIcon,
  SheetIcon,
  ShieldIcon,
  WrenchIcon,
} from '@/components/icons';
import TagList from '@/components/TagList';
import Button from '@/components/ui/Button';
import Disclosure from '@/components/ui/Disclosure';
import IconList from '@/components/ui/IconList';
import Section from '@/components/ui/Section';
import Stat from '@/components/ui/Stat';
import { SECTIONS } from '@/lib/sections';

// Icons matched by `id` in featured.roles / featured.features.
const ROLE_ICONS = {
  supervisors: ClipboardIcon,
  technicians: WrenchIcon,
  admins: ShieldIcon,
  managers: ChartIcon,
};
const FEATURE_ICONS = {
  access: KeyIcon,
  orders: PencilIcon,
  history: HistoryIcon,
  excel: SheetIcon,
};

const subheading = 'mb-4 font-display text-xl font-bold text-base-content';

/**
 * Featured project (Tecnoclima) — the site's strongest piece, so it gets its own
 * full-width band (base-200) instead of sitting on the page background.
 *
 * Always visible: summary, metrics, before/after, roles, features and "why me" — the
 * case at a glance. Behind a disclosure: the long paragraphs (problem, what I built,
 * outcome), since the blocks above already summarize them; showing both would repeat
 * the story and make the section very long on phones. They stay in the HTML for SEO
 * and no-JS.
 */
export default async function FeaturedProject() {
  const t = await getTranslations('featured');
  const tCommon = await getTranslations('common');
  // Empty until there's a public demo; set featured.demo.url in both messages files.
  const demoUrl = t.raw('demo.url');

  return (
    <Section
      id={SECTIONS.featured}
      title={t('title')}
      className="border-y border-base-300 bg-base-200"
      decoration={
        // Decorative layer for the next phase's background effects (gradients).
        <div aria-hidden="true" className="featured-backdrop absolute inset-0 -z-10" />
      }
    >
      <article aria-labelledby="featured-company" className="flex flex-col gap-12">
        {/* Header */}
        <header className="flex flex-col gap-4" data-reveal="fade-up">
          <div className="flex flex-col gap-1">
            <h3 id="featured-company" className="text-3xl font-bold sm:text-4xl">
              {t('company')}
            </h3>
            <p className="font-medium text-base-content">
              {t('role')} · <span className="text-base-content/75">{t('period')}</span>
            </p>
          </div>
          <p className="section-lead">{t('context')}</p>
          <p className="max-w-prose text-base-content">{t('summary')}</p>
          <TagList label={t('techLabel')} items={t.raw('tech')} />
        </header>

        {/* Metrics */}
        <div>
          <h4 className="sr-only">{t('metricsTitle')}</h4>
          <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {t.raw('metrics').map((_, i) => (
              <Stat
                key={i}
                value={t(`metrics.${i}.value`)}
                label={t(`metrics.${i}.label`)}
                data-reveal="fade-up"
                style={{ '--reveal-delay': `${i * 80}ms` }}
              />
            ))}
          </dl>
        </div>

        {/* Before → after */}
        <div data-reveal="fade-up">
          <h4 className={subheading}>{t('comparison.title')}</h4>
          <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr] md:gap-4">
            <div className="rounded-box border border-base-300 bg-base-100 p-5">
              <h5 className="mb-4 text-sm font-semibold tracking-wide text-base-content/75 uppercase">
                {t('comparison.before.title')}
              </h5>
              <IconList
                tone="muted"
                items={t.raw('comparison.before.items').map((_, i) => ({
                  key: i,
                  Icon: CloseIcon,
                  text: t(`comparison.before.items.${i}`),
                }))}
              />
            </div>

            <span aria-hidden="true" className="grid place-items-center text-primary">
              <ArrowRightIcon className="size-6 rotate-90 md:rotate-0" />
            </span>

            <div className="rounded-box border-2 border-primary bg-base-100 p-5">
              <h5 className="mb-4 text-sm font-semibold tracking-wide text-primary uppercase">
                {t('comparison.after.title')}
              </h5>
              <IconList
                tone="solid"
                items={t.raw('comparison.after.items').map((_, i) => ({
                  key: i,
                  Icon: CheckIcon,
                  text: t(`comparison.after.items.${i}`),
                }))}
              />
            </div>
          </div>
        </div>

        {/* Roles */}
        <div>
          <h4 className={subheading} data-reveal="fade-up">
            {t('rolesTitle')}
          </h4>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {t.raw('roles').map(({ id }, i) => {
              const Icon = ROLE_ICONS[id];
              return (
                <li
                  key={id}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 80}ms` }}
                  className="flex gap-4 rounded-box border border-base-300 bg-base-100 p-5 lg:flex-col lg:gap-3"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-field bg-primary/10 text-primary"
                  >
                    <Icon />
                  </span>
                  <div>
                    <p className="font-semibold text-base-content">{t(`roles.${i}.name`)}</p>
                    <p className="text-sm text-base-content/75">{t(`roles.${i}.text`)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Features + why me */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-12">
          <div data-reveal="fade-up">
            <h4 className={subheading}>{t('featuresTitle')}</h4>
            <IconList
              items={t.raw('features').map(({ id }, i) => ({
                key: id,
                Icon: FEATURE_ICONS[id],
                text: t(`features.${i}.text`),
              }))}
            />
          </div>

          <figure
            data-reveal="fade-up"
            style={{ '--reveal-delay': '120ms' }}
            className="relative flex flex-col gap-3 rounded-box border-l-4 border-primary bg-base-100 p-6"
          >
            <QuoteIcon className="size-8 text-primary/40" />
            <figcaption className="order-first text-sm font-semibold tracking-wide text-primary uppercase">
              {t('why.title')}
            </figcaption>
            <blockquote className="text-lg text-base-content">
              <p>{t('why.text')}</p>
            </blockquote>
          </figure>
        </div>

        {/* Screenshots + demo */}
        <div data-reveal="fade-up">
          <h4 className={subheading}>{t('screenshots.title')}</h4>
          {/* TODO(featured): replace with real, anonymized screenshots when available
              (next/image works with `images.unoptimized`; export them sized, AVIF/WebP). */}
          <div className="grid aspect-video max-h-56 w-full place-items-center rounded-box border-2 border-dashed border-base-300 bg-base-100 text-base-content/75">
            <div className="flex flex-col items-center gap-2 text-center">
              <ImageIcon className="size-8" />
              <p>{t('screenshots.placeholder')}</p>
            </div>
          </div>
          {demoUrl && (
            <Button href={demoUrl} target="_blank" rel="noopener noreferrer" className="mt-4">
              {t('demo.label')}
              <span className="sr-only"> {tCommon('opensInNewTab')}</span>
            </Button>
          )}
        </div>

        {/* Full case study */}
        <Disclosure showLabel={t('caseToggle.show')} hideLabel={t('caseToggle.hide')}>
          <div className="flex max-w-prose flex-col gap-5 border-l-2 border-primary/30 pl-4">
            {t.raw('details').map((_, i) => (
              <div key={i}>
                <h4 className="font-semibold text-base-content">{t(`details.${i}.title`)}</h4>
                <p className="text-base-content/75">{t(`details.${i}.text`)}</p>
              </div>
            ))}
          </div>
        </Disclosure>
      </article>
    </Section>
  );
}
