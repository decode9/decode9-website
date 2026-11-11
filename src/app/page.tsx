import type { Metadata, Viewport } from 'next';
import EntryClient from '@/components/Entry/EntryClient';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';
import { withBase } from '@/utils/asset';

export const metadata: Metadata = buildPageMetadata('entry');
export const viewport: Viewport = buildPageViewport('entry');

const EntryPage = () => (
  <>
    {/* Static text for crawlers and no-JS visitors; the interactive page covers it once mounted. */}
    <noscript>
      <h1>Elige tu lado</h1>
      <p>
        <a href={withBase('/decode9/')}>My Hacker Mode: decode9, mi versión investigadora</a>
      </p>
      <p>
        <a href={withBase('/perfil/')}>My Professional Mode: perfil profesional de Jorge Bastidas</a>
      </p>
    </noscript>
    <EntryClient />
  </>
);

export default EntryPage;
