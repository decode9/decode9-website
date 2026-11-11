import type { Metadata, Viewport } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalJsonLd, buildLegalMetadata, legalViewport } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('en', 'terms');
export const viewport: Viewport = legalViewport;

const TermsPage = () => <LegalDocument locale="en" kind="terms" jsonLd={buildLegalJsonLd('en', 'terms')} />;

export default TermsPage;
