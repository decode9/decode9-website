import type { Metadata, Viewport } from 'next';
import JsonLd from '@/components/Seo/JsonLd';
import PageSummary from '@/components/Seo/PageSummary';
import Terminal from '@/components/Terminal';
import { PAGE_SUMMARIES } from '@/data/seo/summaries';
import { serializeJsonLd } from '@/lib/seo/jsonLd';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata('terminal');
export const viewport: Viewport = buildPageViewport('terminal');

const TerminalPage = () => (
  <>
    <JsonLd data={serializeJsonLd('terminal')} />
    {/* The CRT shell has no h1 of its own: the summary stays as the page heading. */}
    <PageSummary copy={PAGE_SUMMARIES.terminal} />
    <Terminal />
  </>
);

export default TerminalPage;
