// Checks WCAG 2.x contrast for every daisyUI theme declared in globals.css.
// Run with `npm run check:contrast`. Exits with code 1 if any pair fails.
//
// Colors are declared in OKLCH; we convert to sRGB (OKLCH → OKLab → linear sRGB),
// then use the WCAG relative-luminance formula. Translucent text (e.g.
// `text-base-content/75`) is alpha-blended over its background in sRGB, the
// same way the browser composites it.
//
// Backgrounds can be a theme color ('base-100') or a stack of translucent layers
// ([['base-100', 1], ['primary', 0.18]]), e.g. text over the hero aurora. Those
// strengths are read from the effect's CSS so the check follows any tweak there.

import { readFileSync } from 'node:fs';

const CSS_PATH = new URL('../src/styles/globals.css', import.meta.url);
const EFFECTS = new URL('../src/animations/effects/', import.meta.url);
const readEffect = (file) => readFileSync(new URL(file, EFFECTS), 'utf8');

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

// Translucent layer strengths declared in an effect's CSS, per theme. Reads
// `--<prefix>-<name>: color-mix(in oklab, var(--color-<color>) <pct>%, transparent)`
// inside `<selector> {…}` and `[data-theme='x'] <selector> {…}`.
// Returns { default: { a: ['primary', 0.12], … }, forest: { … } }.
function parseLayers(css, selector, prefix) {
  const escaped = selector.replace(/[.[\]]/g, '\\$&');
  const blocks = new RegExp(
    String.raw`(?:\[data-theme='([\w-]+)'\]\s*)?${escaped}\s*\{([^}]*)\}`,
    'g',
  );
  const decl = new RegExp(
    String.raw`--${prefix}-(\w+):\s*color-mix\(in oklab, var\(--color-([\w-]+)\) (\d+)%`,
    'g',
  );
  const out = {};
  for (const [, theme = 'default', body] of css.matchAll(blocks)) {
    for (const [, layer, color, pct] of body.matchAll(decl)) {
      (out[theme] ??= {})[layer] = [color, Number(pct) / 100];
    }
  }
  return out;
}

const forTheme = (layers, themeName) => ({ ...layers.default, ...layers[themeName] });

// Text over the hero aurora, worst case: both lights overlapping at full strength.
function auroraPairs(themeName, aurora) {
  const { a, b } = forTheme(aurora, themeName);
  const bg = { label: 'aurora', layers: [['base-100', 1], a, b] };
  // The eyebrow has an opaque background (primary mixed into base-100), so the aurora
  // doesn't reach its text.
  const eyebrowBg = {
    label: 'eyebrow',
    layers: [
      ['base-100', 1],
      ['primary', 0.1],
    ],
  };
  return [
    ['base-content', bg, 4.5], // labels; also the start of the name's gradient
    ['base-content', bg, 4.5, 0.75], // headline, quick facts
    ['primary', bg, 4.5], // outline button, icons; also the end of the name's gradient
    ['primary', eyebrowBg, 4.5], // role eyebrow
  ];
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

// Composite a background spec (color key or layer stack) into one sRGB color.
function background(theme, spec) {
  if (typeof spec === 'string') return oklchToSrgb(theme.colors[spec]);
  return spec.layers.reduce(
    (acc, [key, alpha]) => blend(oklchToSrgb(theme.colors[key]), acc ?? [0, 0, 0], alpha),
    null,
  );
}

// Text on the featured band (base-200) under its corner glows; the glows sit in
// opposite corners, so the worst case is the stronger one alone.
function featuredPairs(themeName, glow) {
  const { a, b } = forTheme(glow, themeName);
  const strongest = a[1] >= b[1] ? a : b;
  const bg = { label: 'featured glow', layers: [['base-200', 1], strongest] };
  return [
    ['base-content', bg, 4.5],
    ['base-content', bg, 4.5, 0.75],
    ['primary', bg, 4.5],
  ];
}

// Text inside a [data-spotlight] card (base-100) at the center of the cursor glow.
function spotlightPairs(themeName, spot) {
  const { glow } = forTheme(spot, themeName);
  const bg = { label: 'spotlight', layers: [['base-100', 1], glow] };
  return [
    ['base-content', bg, 4.5],
    ['base-content', bg, 4.5, 0.75],
    ['primary', bg, 4.5],
  ];
}

const aurora = parseLayers(readEffect('aurora.css'), '.hero-backdrop', 'aurora');
const glow = parseLayers(readEffect('featured-backdrop.css'), '.featured-backdrop', 'glow');
const spot = parseLayers(readEffect('spotlight.css'), '[data-spotlight]', 'spot');

let failed = 0;
for (const theme of parseThemes(readFileSync(CSS_PATH, 'utf8'))) {
  console.log(`\n${theme.name}`);
  for (const [fgKey, bgSpec, min, alpha = 1] of [
    ...PAIRS,
    ...auroraPairs(theme.name, aurora),
    ...featuredPairs(theme.name, glow),
    ...spotlightPairs(theme.name, spot),
  ]) {
    const bg = background(theme, bgSpec);
    const fg = blend(oklchToSrgb(theme.colors[fgKey]), bg, alpha);
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failed++;
    const bgLabel = typeof bgSpec === 'string' ? bgSpec : bgSpec.label;
    const label = `${fgKey}${alpha < 1 ? `/${alpha * 100}` : ''} on ${bgLabel}`;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(34)} ${r.toFixed(2)}:1 (min ${min})`);
  }
}

if (failed) {
  console.error(`\n${failed} pair(s) below the WCAG AA minimum.`);
  process.exit(1);
}
console.log('\nAll pairs meet WCAG AA.');
