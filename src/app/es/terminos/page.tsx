import type { Metadata, Viewport } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalJsonLd, buildLegalMetadata, legalViewport } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('es', 'terms');
export const viewport: Viewport = legalViewport;

const TerminosPage = () => <LegalDocument locale="es" kind="terms" jsonLd={buildLegalJsonLd('es', 'terms')} />;

export default TerminosPage;
