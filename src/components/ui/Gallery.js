'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { CloseIcon } from '@/components/icons';
import { button } from '@/components/ui/Button';

/**
 * Screenshot grid with a lightbox.
 * - Each thumbnail is a link to the full image, so it still works without JS; with JS
 *   the click opens a native <dialog> instead (focus trap, Esc and focus return for free).
 * - `groups` are rendered in order, each with its own layout classes; each item brings
 *   its own figure width (`className`), thumbnail box (`imageClassName`) and `sizes`, so
 *   the caption takes the thumbnail's width.
 * - Clicking the backdrop (outside the figure) also closes the dialog.
 */
export default function Gallery({ groups, openLabel, closeLabel }) {
  const dialogRef = useRef(null);
  const [current, setCurrent] = useState(null);

  const open = (event, item) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setCurrent(item);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-6">
        {groups.map(({ key, className, items }) => (
          <div key={key} className={className}>
            {items.map((item) => (
              <figure key={item.src} className={`flex flex-col gap-2 ${item.className ?? ''}`}>
                <a
                  href={item.src}
                  onClick={(event) => open(event, item)}
                  className="block overflow-hidden rounded-box border border-base-300 bg-base-100 transition-colors hover:border-primary focus-visible:border-primary motion-reduce:transition-none"
                >
                  <Image
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={item.alt}
                    sizes={item.sizes}
                    className={`h-auto w-full ${item.imageClassName}`}
                  />
                  <span className="sr-only"> ({openLabel})</span>
                </a>
                <figcaption className="text-sm text-base-content/75">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current?.alt}
        onClose={() => setCurrent(null)}
        onClick={(event) => event.target === event.currentTarget && close()}
        className="modal motion-reduce:transition-none"
      >
        <figure className="modal-box flex max-h-[95dvh] w-auto max-w-[min(95vw,90rem)] flex-col gap-3 p-3 motion-reduce:transition-none sm:p-4">
          <button
            type="button"
            onClick={close}
            aria-label={closeLabel}
            className={button({
              intent: 'ghost',
              size: 'sm',
              square: true,
              className: 'self-end',
            })}
          >
            <CloseIcon className="size-5" />
          </button>
          {current && (
            <>
              <Image
                src={current.src}
                width={current.width}
                height={current.height}
                alt={current.alt}
                className="max-h-[75dvh] w-auto max-w-full self-center object-contain"
              />
              <figcaption className="text-sm text-base-content/75">{current.caption}</figcaption>
            </>
          )}
        </figure>
      </dialog>
    </>
  );
}
