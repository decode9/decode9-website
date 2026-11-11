import type { Metadata, Viewport } from 'next';
import ProfileClient from '@/components/Profile/ProfileClient';
import JsonLd from '@/components/Seo/JsonLd';
import PageSummary from '@/components/Seo/PageSummary';
import ProfileChapters from '@/components/Seo/ProfileChapters';
import { CHAPTERS, CHAPTER_ORDER, plainText } from '@/data/profile/chapters';
import { PAGE_SUMMARIES } from '@/data/seo/summaries';
import { serializeJsonLd } from '@/lib/seo/jsonLd';
import { buildPageMetadata, buildPageViewport } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata('profile');
export const viewport: Viewport = buildPageViewport('profile');

const ProfilePage = () => (
  <>
    <JsonLd data={serializeJsonLd('profile')} />
    {/* The top bar brings its own h1 on mount; the chapters stay (the 3D page shows them one panel at a time). */}
    <PageSummary copy={PAGE_SUMMARIES.profile} replaceOnMount>
      <ProfileChapters chapters={CHAPTERS} order={CHAPTER_ORDER} toText={plainText} />
    </PageSummary>
    <ProfileClient />
  </>
);

export default ProfilePage;
