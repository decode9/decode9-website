import type { Metadata, Viewport } from 'next';
import Terminal from '@/components/Terminal';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata('terminal');
export const viewport: Viewport = buildPageViewport('terminal');

const TerminalPage = () => <Terminal />;

export default TerminalPage;
