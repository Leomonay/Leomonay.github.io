import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { OG_IMAGE_SIZE } from '@/lib/site';

// Open Graph / Twitter Card image, rendered once per locale at build time
// (out/es/og.png, out/en/og.png) and referenced from generateMetadata in the layout.
//
// Why a route handler and not the `opengraph-image.js` convention: the convention only
// takes a static `alt`, and its per-image variant (generateImageMetadata) doesn't receive
// the [locale] param during a static export. Here the alt text is translated in the layout.

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// An image can't read CSS variables, so these are the 'forest' theme colors
// (globals.css) converted from OKLCH to hex.
const COLORS = {
  background: '#0a1711',
  surface: '#15261e',
  text: '#dbe9df',
  primary: '#68d7a1',
};

export async function GET(_request, { params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 32,
        padding: 80,
        background: COLORS.background,
        color: COLORS.text,
        borderLeft: `24px solid ${COLORS.primary}`,
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2 }}>{t('name')}</div>
      <div style={{ fontSize: 40, lineHeight: 1.3, maxWidth: 960 }}>{t('headline')}</div>
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        {t
          .raw('stack')
          .slice(0, 5)
          .map((tech) => (
            <div
              key={tech}
              style={{
                fontSize: 26,
                padding: '8px 22px',
                borderRadius: 999,
                background: COLORS.surface,
                color: COLORS.primary,
              }}
            >
              {tech}
            </div>
          ))}
      </div>
    </div>,
    OG_IMAGE_SIZE,
  );
}
