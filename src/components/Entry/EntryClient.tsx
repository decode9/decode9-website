'use client';

import dynamic from 'next/dynamic';

/** Client-only mount of <Entry /> (canvas, sensors and window APIs); the page keeps a static SEO fallback. */
const EntryClient = dynamic(() => import('./index'), { ssr: false });

export default EntryClient;
