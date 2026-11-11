import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import RootDocument from '@/components/Layout/RootDocument';
import { baseMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = baseMetadata;

const RootLayout = ({ children }: { children: ReactNode }) => <RootDocument>{children}</RootDocument>;

export default RootLayout;
