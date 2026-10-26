import type { Metadata } from 'next';
import LegalDocument from '@/components/Legal/LegalDocument';
import { buildLegalMetadata } from '@/lib/seo/legalMetadata';

export const metadata: Metadata = buildLegalMetadata('en', 'privacy');

const PrivacyPage = () => <LegalDocument locale="en" kind="privacy" />;

export default PrivacyPage;
