import Card from '@/components/ui/Card';
import Disclosure from '@/components/ui/Disclosure';
import Gallery from '@/components/ui/Gallery';
import TagList from '@/components/TagList';
import { THUMB_LAYOUTS } from '@/lib/screenshots';

// Full-page captures of the sites a job built (`sites` in messages), in
// /projects/<job id>/<site id>-home-<device>.webp plus a lighter top crop
// (`-thumb`) for the thumbnail.
const SITE_SHOTS = {
  kelp: {
    desktop: { width: 1600, height: 5516 },
    mobile: { width: 750, height: 9036 },
  },
  anagolay: {
    desktop: { width: 1600, height: 8478 },
    mobile: { width: 750, height: 16383 },
  },
};
const SITE_DEVICES = {
  desktop: {
    ...THUMB_LAYOUTS.desktop,
    thumb: { width: 800, height: 450 },
    lightboxClassName: 'w-[min(90vw,64rem)]',
  },
  mobile: {
    ...THUMB_LAYOUTS.phone,
    thumb: { width: 400, height: 711 },
    lightboxClassName: 'w-[min(90vw,24rem)]',
  },
};

/**
 * One job. Two levels of reading:
 * - Visible: role, period, context, technologies and achievement bullets.
 * - On expand: detail paragraphs, only when the job has `details` — one-line jobs
 *   render without a toggle.
 * - Jobs with `sites` show a capture of each one (desktop + phone) with a link to
 *   its archived version.
 *
 * Rendered on the server; only <Disclosure> and <Gallery> ship JavaScript.
 */
export default function ExperienceItem({ item, index, t, newTabLabel }) {
  const key = `items.${index}`;

  // Rich tags available to any experience string, e.g. "<link>Kelp Digital</link>".
  const rich = {
    link: (chunks) => (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-grow text-primary"
      >
        {chunks}
        <span className="sr-only"> {newTabLabel}</span>
      </a>
    ),
  };

  return (
    <li data-reveal="fade-up" className="relative">
      {/* Timeline dot, aligned with the list's left border from sm up. */}
      <span
        aria-hidden="true"
        className="absolute top-7 -left-[2.4rem] hidden size-3 rounded-full bg-primary ring-4 ring-base-100 sm:block"
      />

      <Card
        as="article"
        interactive
        gradientBorder
        data-spotlight
        title={t(`${key}.company`)}
        meta={`${t(`${key}.role`)} · ${t(`${key}.period`)}`}
      >
        {item.context && <p className="text-base-content/75">{t(`${key}.context`)}</p>}

        <TagList label={t('techLabel')} items={item.tech} />

        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-primary">
          {item.highlights.map((_, i) => (
            <li key={i}>{t.rich(`${key}.highlights.${i}`, rich)}</li>
          ))}
        </ul>

        {item.sites?.length > 0 && (
          <div>
            <h4 className="mb-3 font-semibold text-base-content">{t('screenshots.title')}</h4>
            <Gallery
              openLabel={t('screenshots.open')}
              closeLabel={t('screenshots.close')}
              groups={item.sites.map(({ id, name, archiveUrl }, i) => ({
                key: id,
                className: 'flex flex-wrap items-start gap-4',
                items: Object.entries(SITE_DEVICES).map(([device, { thumb, ...layout }]) => {
                  const base = `/projects/${item.id}/${id}-home-${device}`;
                  return {
                    ...layout,
                    ...SITE_SHOTS[id][device],
                    src: `${base}.webp`,
                    thumb: { ...thumb, src: `${base}-thumb.webp` },
                    fullPage: true,
                    alt: t(`${key}.sites.${i}.${device}Alt`),
                    caption: t(`screenshots.${device}Caption`, { site: name }),
                  };
                }),
                footer: (
                  <a
                    href={archiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-grow self-start text-sm text-primary"
                  >
                    {t.rich('screenshots.archive', {
                      site: name,
                      sr: (chunks) => <span className="sr-only">{chunks}</span>,
                    })}
                    <span className="sr-only"> {newTabLabel}</span>
                  </a>
                ),
              }))}
            />
          </div>
        )}

        {item.details?.length > 0 && (
          <Disclosure
            showLabel={t('toggle.show')}
            hideLabel={t('toggle.hide')}
            context={t('toggle.context', { company: item.company })}
          >
            <div className="flex flex-col gap-4 border-l-2 border-primary/30 pl-4">
              {item.details.map((detail, i) => (
                <div key={i}>
                  {detail.title && (
                    <h4 className="font-semibold text-base-content">
                      {t(`${key}.details.${i}.title`)}
                    </h4>
                  )}
                  <p className="text-base-content/75">{t(`${key}.details.${i}.text`)}</p>
                </div>
              ))}
            </div>
          </Disclosure>
        )}
      </Card>
    </li>
  );
}
