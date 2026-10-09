import { cn } from 'tailwind-variants';

/**
 * Page section: <section> landmark labelled by its <h2>, with the shared container
 * and vertical rhythm. Every section of the page uses it, so anchors (#id), heading
 * levels and spacing stay consistent.
 */
export default function Section({ id, title, className, children }) {
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('section', className)}>
      <div className="container-page">
        <h2 id={titleId} className="section-title" data-reveal="fade-up">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
