import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import RootDocument from '@/components/Layout/RootDocument';
import { getDictionary } from '@/i18n';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata('es', getDictionary('es'));

const SpanishLayout = ({ children }: { children: ReactNode }) => <RootDocument locale="es">{children}</RootDocument>;

export default SpanishLayout;
