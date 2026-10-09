import { tv } from 'tailwind-variants';

export const iconList = tv({
  slots: {
    list: 'flex flex-col gap-3',
    item: 'flex items-start gap-3',
    bubble: 'grid size-8 shrink-0 place-items-center rounded-full',
    text: 'pt-1',
  },
  variants: {
    tone: {
      primary: { bubble: 'bg-primary/10 text-primary', text: 'text-base-content' },
      muted: { bubble: 'bg-base-300 text-base-content/75', text: 'text-base-content/75' },
      solid: { bubble: 'bg-primary text-primary-content', text: 'text-base-content' },
    },
    columns: {
      1: {},
      2: { list: 'sm:grid sm:grid-cols-2 sm:gap-x-6' },
    },
  },
  defaultVariants: { tone: 'primary', columns: 1 },
});

/**
 * List with an icon per item. `items` is [{ key, Icon, text }]; icons are decorative,
 * so the text carries the meaning.
 */
export default function IconList({ items, tone, columns, className, ...props }) {
  const s = iconList({ tone, columns });
  return (
    <ul className={s.list({ className })} {...props}>
      {items.map(({ key, Icon, text }) => (
        <li key={key} className={s.item()}>
          <span aria-hidden="true" className={s.bubble()}>
            <Icon className="size-4" />
          </span>
          <span className={s.text()}>{text}</span>
        </li>
      ))}
    </ul>
  );
}
