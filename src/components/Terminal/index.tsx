'use client';

import dynamic from 'next/dynamic';
import type { TerminalProps } from './interface';

/* The shell touches window, canvas and Web Audio: it is mounted only on the client. */
const Shell = dynamic(() => import('./components/Shell'), { ssr: false });

/** decode9 · Terminal (/decode9/). The indexable summary lives in app/decode9/page.tsx; the CRT shell mounts on the client. */
const Terminal = (_props: TerminalProps) => <Shell />;

export default Terminal;
