import type { Metadata } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalMetadata } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('es', 'terms');

const TerminosPage = () => <LegalDocument locale="es" kind="terms" />;

export default TerminosPage;
