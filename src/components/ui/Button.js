import { tv } from 'tailwind-variants';

// tailwind-variants over cva: it merges conflicting classes out of the box (a `className`
// override like `px-8` replaces the variant's padding instead of fighting it), and it
// supports slots, which multi-part components such as Card need.
export const button = tv({
  base: 'btn gap-2 rounded-full font-semibold',
  variants: {
    intent: {
      primary: 'btn-primary',
      outline: 'btn-outline btn-primary',
      ghost: 'btn-ghost',
    },
    size: {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    },
    square: {
      true: 'btn-square',
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});

// Renders a link when it gets an `href`, otherwise a <button type="button">.
// Same look either way, but the right element for the job (navigation vs. action).
export default function Button({ href, intent, size, square, className, ...props }) {
  const classes = button({ intent, size, square, className });

  if (href) return <a href={href} className={classes} {...props} />;
  return <button type="button" className={classes} {...props} />;
}
