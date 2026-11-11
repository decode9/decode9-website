import type { Metadata, Viewport } from 'next';
import { withBase } from '@/utils/asset';
import { buildViewport } from '@/lib/seo/metadata';
import { PAGES } from '@/lib/seo/site';

/** 404 of the static export (out/404.html): never indexed. */
export const metadata: Metadata = {
  title: 'Señal perdida: página no encontrada',
  description: 'Esta página no existe en decode9.codes. Vuelve a la entrada para elegir tu lado.',
  robots: { index: false, follow: true },
};

export const viewport: Viewport = buildViewport(PAGES.entry.themeColor);

const STYLE = {
  minHeight: '100vh',
  display: 'grid',
  placeContent: 'center',
  gap: '1rem',
  padding: '2rem',
  textAlign: 'center',
  background: '#0b0b10',
  color: '#e8e8f0',
  fontFamily: 'var(--font-share), monospace',
} as const;

const NotFound = () => (
  <main style={STYLE}>
    <h1>404 · Señal perdida</h1>
    <p>Esta página no existe.</p>
    <p>
      <a href={withBase('/')} style={{ color: '#ff5c5c' }}>
        Volver a la entrada
      </a>
    </p>
  </main>
);

export default NotFound;
