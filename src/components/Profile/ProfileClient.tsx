'use client';

import dynamic from 'next/dynamic';

/** Client-only mount of <Profile /> (WebGL, Web Audio, window APIs); the page keeps a static SEO fallback. */
const ProfileClient = dynamic(() => import('./index'), { ssr: false });

export default ProfileClient;
