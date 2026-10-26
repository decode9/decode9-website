import type { Metadata } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalMetadata } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('en', 'terms');

const TermsPage = () => <LegalDocument locale="en" kind="terms" />;

export default TermsPage;
