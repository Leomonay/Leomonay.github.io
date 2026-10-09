'use client';

import { useId, useState } from 'react';
import { ChevronDownIcon } from '@/components/icons';
import { button } from '@/components/ui/Button';

/**
 * Accessible show/hide panel (WAI-ARIA disclosure pattern).
 * - A real <button> (Enter/Space for free) with aria-expanded and aria-controls.
 * - `context` is appended for screen readers only, so several "Show details" buttons
 *   on the page are distinguishable ("Show details for LaTech").
 * - The panel content is server-rendered and always in the HTML (good for SEO and
 *   no-JS); collapsing is purely CSS (src/animations/effects/disclosure.css).
 */
export default function Disclosure({ showLabel, hideLabel, context, children }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={button({
          intent: 'ghost',
          size: 'sm',
          className: 'disclosure-trigger -ml-3 text-primary',
        })}
      >
        {open ? hideLabel : showLabel}
        {context && <span className="sr-only"> {context}</span>}
        <ChevronDownIcon className="disclosure-icon size-4" />
      </button>

      <div id={panelId} className="disclosure-panel" data-open={open || undefined}>
        <div>
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
