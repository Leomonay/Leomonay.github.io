import { routing } from '@/i18n/routing';
import { localeRedirectScript } from '@/lib/inline-scripts';
import '@/styles/globals.css';

// Second root layout, only for `/`. It lives in a route group so it doesn't add a URL
// segment, and it is separate from [locale] because `/` has no language of its own.
export default function RootRedirectLayout({ children }) {
  return (
    <html lang={routing.defaultLocale}>
      <head>
        {/* Runs before the body is parsed, so visitors with JS never see this page. */}
        <script dangerouslySetInnerHTML={{ __html: localeRedirectScript() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
