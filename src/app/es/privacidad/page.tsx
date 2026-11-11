import type { Metadata, Viewport } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalJsonLd, buildLegalMetadata, legalViewport } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('es', 'privacy');
export const viewport: Viewport = legalViewport;

const PrivacidadPage = () => <LegalDocument locale="es" kind="privacy" jsonLd={buildLegalJsonLd('es', 'privacy')} />;

export default PrivacidadPage;
