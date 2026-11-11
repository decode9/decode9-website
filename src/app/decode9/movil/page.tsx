import type { Metadata, Viewport } from 'next';
import TransmitterLoader from '@/components/Transmitter/TransmitterLoader';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';
import { PAGES } from '@/lib/seo/site';

export const metadata: Metadata = buildPageMetadata('transmitter');
export const viewport: Viewport = buildPageViewport('transmitter');

const SR_ONLY = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } as const;

const TransmitterPage = () => (
  <>
    <h1 style={SR_ONLY}>{PAGES.transmitter.title}</h1>
    <p style={SR_ONLY}>{PAGES.transmitter.description}</p>
    <TransmitterLoader />
  </>
);

export default TransmitterPage;
