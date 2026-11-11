import type { Metadata, Viewport } from 'next';
import EntryClient from '@/components/Entry/EntryClient';
import JsonLd from '@/components/Seo/JsonLd';
import PageSummary from '@/components/Seo/PageSummary';
import { PAGE_SUMMARIES } from '@/data/seo/summaries';
import { serializeJsonLd } from '@/lib/seo/jsonLd';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata('entry');
export const viewport: Viewport = buildPageViewport('entry');

const EntryPage = () => (
  <>
    <JsonLd data={serializeJsonLd('entry')} />
    {/* The entry paints the same copy with its own h1 once mounted. */}
    <PageSummary copy={PAGE_SUMMARIES.entry} replaceOnMount />
    <EntryClient />
  </>
);

export default EntryPage;
