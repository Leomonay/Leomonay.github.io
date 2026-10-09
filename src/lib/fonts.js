import { Bricolage_Grotesque, Inter } from 'next/font/google';

// next/font downloads the fonts at build time and serves them from the site itself:
// no request to Google at runtime, and size-adjusted fallbacks avoid layout shift.

// Headings: a grotesque with character, used sparingly.
const heading = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

// Body: highly legible at small sizes on phones.
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Applied to <html> in every root layout; globals.css maps them to Tailwind's font-sans/font-display.
export const fontVariables = `${heading.variable} ${body.variable}`;
