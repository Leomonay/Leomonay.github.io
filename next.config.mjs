/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export for GitHub Pages: no server, no proxy, no image optimizer.
  output: 'export',
  // Emits /es/index.html instead of /es.html, so GitHub Pages serves /es/ directly.
  trailingSlash: true,
  // The default image loader needs a server; with a static export images are served as-is.
  images: { unoptimized: true },
};

export default nextConfig;
