import type { Metadata } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalMetadata } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('es', 'privacy');

const PrivacidadPage = () => <LegalDocument locale="es" kind="privacy" />;

export default PrivacidadPage;
