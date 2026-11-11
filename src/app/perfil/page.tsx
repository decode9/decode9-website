import type { Metadata, Viewport } from 'next';
import ProfileClient from '@/components/Profile/ProfileClient';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';
import { withBase } from '@/utils/asset';

export const metadata: Metadata = buildPageMetadata('profile');
export const viewport: Viewport = buildPageViewport('profile');

const ProfilePage = () => (
  <>
    {/* Static text for crawlers and no-JS visitors; the interactive page covers it once mounted. */}
    <noscript>
      <h1>Jorge Bastidas · CTO · the empire</h1>
      <p>Jorge Bastidas terraforma ideas: viaja por una galaxia de mundos y los convierte en sistemas completos.</p>
      <p>
        <a href={withBase('/decode9/')}>decode9, mi versión investigadora</a> ·{' '}
        <a href="https://theempire.tech">the empire</a>
      </p>
    </noscript>
    <ProfileClient />
  </>
);

export default ProfilePage;
