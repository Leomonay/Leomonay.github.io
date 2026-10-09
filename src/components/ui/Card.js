import { tv } from 'tailwind-variants';

// Slots style each part of the card from one definition, and a variant can touch
// several slots at once (e.g. `interactive` changes the root and the title).
export const card = tv({
  slots: {
    root: 'rounded-box border border-base-300 bg-base-100 p-5 sm:p-6',
    header: 'flex flex-col gap-1',
    title: 'text-xl font-bold text-base-content',
    meta: 'text-sm text-base-content/75',
    body: 'mt-4 flex flex-col gap-4',
  },
  variants: {
    tone: {
      plain: {},
      raised: { root: 'bg-base-200' },
    },
    // Hover lift for cards. The motion itself is disabled under prefers-reduced-motion.
    interactive: {
      true: {
        root: 'transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        title: 'transition-colors group-hover:text-primary',
      },
    },
  },
  defaultVariants: {
    tone: 'plain',
    interactive: false,
  },
});

/**
 * Generic card. `as` sets the root element (e.g. "article", "li") so the
 * markup stays semantic; `title`/`meta` render the header when provided.
 */
export default function Card({
  as: Root = 'div',
  title,
  titleAs: Title = 'h3',
  meta,
  tone,
  interactive,
  className,
  children,
  ...props
}) {
  const s = card({ tone, interactive });

  return (
    <Root className={s.root({ className: [interactive && 'group', className] })} {...props}>
      {(title || meta) && (
        <header className={s.header()}>
          {title && <Title className={s.title()}>{title}</Title>}
          {meta && <p className={s.meta()}>{meta}</p>}
        </header>
      )}
      {children && <div className={s.body()}>{children}</div>}
    </Root>
  );
}
