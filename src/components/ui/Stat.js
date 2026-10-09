import { tv } from 'tailwind-variants';

export const stat = tv({
  slots: {
    // flex-col-reverse: the value reads first visually, while the DOM keeps
    // <dt> (label) before <dd> (value), which is the order a <dl> requires.
    root: 'flex flex-col-reverse justify-end gap-1 rounded-box border border-base-300 bg-base-100 p-5',
    value: 'font-display text-4xl font-bold text-primary tabular-nums sm:text-5xl',
    label: 'text-sm text-base-content/75',
  },
});

/** One metric inside a <dl>: big value, short label. */
export default function Stat({ value, label, className, ...props }) {
  const s = stat();
  return (
    <div className={s.root({ className })} {...props}>
      <dt className={s.label()}>{label}</dt>
      <dd className={s.value()}>{value}</dd>
    </div>
  );
}
