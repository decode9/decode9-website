import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import RootDocument from '@/components/Layout/RootDocument';
import { getDictionary } from '@/i18n';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata('en', getDictionary('en'));

const EnglishLayout = ({ children }: { children: ReactNode }) => <RootDocument locale="en">{children}</RootDocument>;

export default EnglishLayout;
