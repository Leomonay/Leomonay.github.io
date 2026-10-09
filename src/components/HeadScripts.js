import { themeScript } from '@/lib/inline-scripts';

// Blocking scripts that must run before the first paint. Rendered inside <head> by every
// root layout. A plain <script> (not next/script) is used on purpose: next/script's
// "beforeInteractive" still waits for the framework, which is too late to prevent a flash.
export default function HeadScripts({ children }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
      {children}
    </>
  );
}
