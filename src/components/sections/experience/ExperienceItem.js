import Card from '@/components/ui/Card';
import Disclosure from '@/components/ui/Disclosure';
import TagList from '@/components/TagList';

/**
 * One job. Two levels of reading:
 * - Visible: role, period, context, technologies and achievement bullets.
 * - On expand: detail paragraphs, only when the job has `details` — one-line jobs
 *   render without a toggle.
 *
 * Rendered on the server; only <Disclosure> ships JavaScript.
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
