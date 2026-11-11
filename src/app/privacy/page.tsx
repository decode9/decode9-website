import type { Metadata, Viewport } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalJsonLd, buildLegalMetadata, legalViewport } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('en', 'privacy');
export const viewport: Viewport = legalViewport;

const PrivacyPage = () => <LegalDocument locale="en" kind="privacy" jsonLd={buildLegalJsonLd('en', 'privacy')} />;

export default PrivacyPage;
