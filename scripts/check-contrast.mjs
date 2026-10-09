// Checks WCAG 2.x contrast for every daisyUI theme declared in globals.css.
// Run with `npm run check:contrast`. Exits with code 1 if any pair fails.
//
// Colors are declared in OKLCH; we convert to sRGB (OKLCH → OKLab → linear sRGB),
// then use the WCAG relative-luminance formula. Translucent text (e.g.
// `text-base-content/75`) is alpha-blended over its background in sRGB, the
// same way the browser composites it.

import { readFileSync } from 'node:fs';

const CSS_PATH = new URL('../src/styles/globals.css', import.meta.url);

// [foreground, background, minimum ratio, alpha of the foreground]
const PAIRS = [
  ['base-content', 'base-100', 4.5],
  ['base-content', 'base-200', 4.5],
  ['base-content', 'base-300', 4.5],
  // Muted text used for secondary copy (`text-base-content/75`).
  ['base-content', 'base-100', 4.5, 0.75],
  ['base-content', 'base-200', 4.5, 0.75],
  // Brand colors used as text (links, accents) on page backgrounds.
  ['primary', 'base-100', 4.5],
  ['primary', 'base-200', 4.5],
  ['secondary', 'base-100', 4.5],
  // Filled components: text on its own color.
  ...['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'].map(
    (c) => [`${c}-content`, c, 4.5],
  ),
];

function parseThemes(css) {
  const blocks = css.matchAll(/@plugin\s+["']daisyui\/theme["']\s*\{([^}]*)\}/g);
  return [...blocks].map(([, body]) => ({
    name: body.match(/name:\s*['"]([^'"]+)['"]/)[1],
    colors: Object.fromEntries(
      [...body.matchAll(/--color-([\w-]+):\s*oklch\(([^)]+)\)/g)].map(([, key, value]) => {
        const [l, c, h] = value.trim().split(/\s+/);
        const L = l.endsWith('%') ? parseFloat(l) / 100 : parseFloat(l);
        return [key, [L, parseFloat(c), parseFloat(h)]];
      }),
    ),
  }));
}

function oklchToSrgb([L, C, H]) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  // Gamma-encode and clamp to the sRGB gamut.
  return linear.map((v) => {
    const x = Math.min(1, Math.max(0, v));
    return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
  });
}

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const blend = (fg, bg, alpha) => fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = 0;
for (const theme of parseThemes(readFileSync(CSS_PATH, 'utf8'))) {
  console.log(`\n${theme.name}`);
  for (const [fgKey, bgKey, min, alpha = 1] of PAIRS) {
    const bg = oklchToSrgb(theme.colors[bgKey]);
    const fg = blend(oklchToSrgb(theme.colors[fgKey]), bg, alpha);
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failed++;
    const label = `${fgKey}${alpha < 1 ? `/${alpha * 100}` : ''} on ${bgKey}`;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(34)} ${r.toFixed(2)}:1 (min ${min})`);
  }
}

if (failed) {
  console.error(`\n${failed} pair(s) below the WCAG AA minimum.`);
  process.exit(1);
}
console.log('\nAll pairs meet WCAG AA.');
