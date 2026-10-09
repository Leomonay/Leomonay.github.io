import createNextIntlPlugin from 'next-intl/plugin';

// Points next-intl at the request config that loads messages per locale.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export for GitHub Pages: no server, no proxy, no image optimizer.
  output: 'export',
  // Emits /es/index.html instead of /es.html, so GitHub Pages serves /es/ directly.
  trailingSlash: true,
  // The default image loader needs a server; with a static export images are served as-is.
  images: { unoptimized: true },
  experimental: {
    // Needed because the app has two root layouts ([locale] and (root)); see global-not-found.js.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
