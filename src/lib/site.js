// Production origin, used for absolute URLs in hreflang, Open Graph, sitemap and robots.
// The site is published as a GitHub Pages *user* site, so there is no basePath.
export const SITE_URL = 'https://leomonay.github.io';

// Path of a locale's home page. trailingSlash is on, so URLs always end with "/".
export const localePath = (locale) => `/${locale}/`;

// Open Graph image size (the 1.91:1 ratio recommended by Facebook, LinkedIn and X).
export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

// Profile links. Not translated text, so they live here instead of messages/*.json;
// their visible labels do come from messages (hero.links.*).
export const PROFILE = {
  github: 'https://github.com/Leomonay',
  linkedin: 'https://www.linkedin.com/in/leomonay/',
  email: 'leonardomonay@gmail.com',
};

// This site's repository (its final name after the GitHub Pages rename; see README → Publicación).
export const SOURCE_URL = 'https://github.com/Leomonay/leomonay.github.io';
