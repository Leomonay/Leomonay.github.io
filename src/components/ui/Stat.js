import { tv } from 'tailwind-variants';

export const stat = tv({
  slots: {
    // flex-col-reverse: the value reads first visually, while the DOM keeps
    // <dt> (label) before <dd> (value), which is the order a <dl> requires.
    root: 'flex flex-col-reverse justify-end gap-1 rounded-box border border-base-300 bg-base-100 p-5',
    value: 'font-display text-4xl font-bold text-primary tabular-nums sm:text-5xl',
    label: 'text-sm text-base-content/75',
    // Two copies stacked in one grid cell: an invisible one with the final value
    // reserves the width, so the count-up never changes the layout (CLS stays 0).
    counter: 'inline-grid',
    counterCell: '[grid-area:1/1]',
  },
});

/**
 * One metric inside a <dl>: big value, short label.
 * With `animate`, CounterController counts the visible digits up from 0 when the
 * card scrolls into view; screen readers read the sr-only final value instead.
 */
export default function Stat({ value, label, animate = false, className, ...props }) {
  const s = stat();
  return (
    <div className={s.root({ className })} {...props}>
      <dt className={s.label()}>{label}</dt>
      <dd className={s.value()}>
        {animate ? (
          <>
            <span className="sr-only">{value}</span>
            <span aria-hidden="true" className={s.counter()}>
              <span className={`${s.counterCell()} invisible`}>{value}</span>
              <span className={s.counterCell()} data-count={value}>
                {value}
              </span>
            </span>
          </>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
