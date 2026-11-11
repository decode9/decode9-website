import type { Metadata, Viewport } from 'next';
import JsonLd from '@/components/Seo/JsonLd';
import PageSummary from '@/components/Seo/PageSummary';
import TransmitterLoader from '@/components/Transmitter/TransmitterLoader';
import { PAGE_SUMMARIES } from '@/data/seo/summaries';
import { serializeJsonLd } from '@/lib/seo/jsonLd';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata('transmitter');
export const viewport: Viewport = buildPageViewport('transmitter');

const TransmitterPage = () => (
  <>
    <JsonLd data={serializeJsonLd('transmitter')} />
    {/* The transmitter has no h1 of its own: the summary stays as the page heading. */}
    <PageSummary copy={PAGE_SUMMARIES.transmitter} />
    <TransmitterLoader />
  </>
);

export default TransmitterPage;
