import { SITE_URL } from '@/lib/site';

// Emitted as out/robots.txt.
export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
