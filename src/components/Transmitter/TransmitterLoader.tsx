'use client';

import dynamic from 'next/dynamic';

/** Client-only mount of the transmitter (Web Audio, sensors, `?alias=`): no SSR. */
const TransmitterLoader = dynamic(() => import('./index'), { ssr: false });

export default TransmitterLoader;
