// Thumbnail layouts shared by every <Gallery>: each sets the figure width, the
// thumbnail box and `sizes`. The lightbox always shows the full image.
export const THUMB_LAYOUTS = {
  // Full width on small screens; from sm, ~300×170 (16:9).
  desktop: {
    className: 'w-full sm:w-[300px]',
    imageClassName: 'aspect-video',
    sizes: '(min-width: 40rem) 300px, 100vw',
  },
  // Side by side on small screens; from sm, ~102×170 (3:5) cropped to the top of the screen.
  phone: {
    className: 'w-[calc(50%-0.5rem)] sm:w-[102px]',
    imageClassName: 'aspect-[750/1334] object-cover object-top sm:aspect-[3/5]',
    sizes: '(min-width: 40rem) 102px, 50vw',
  },
};
