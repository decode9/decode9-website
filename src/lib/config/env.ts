export const SOLVO_CHAT_KEY_PATTERN = /^wpk_[a-f0-9]{32}$/;

export interface SolvoConfig {
  baseUrl: string;
  chatKey: string;
}

interface RawSolvoConfig {
  baseUrl?: string;
  chatKey?: string;
}

/**
 * NEXT_PUBLIC_* values are inlined at build time only when accessed literally,
 * hence the explicit defaults. Both values are public by design (Solvo's own
 * widget exposes the key in a <script> tag).
 */
export const readSolvoConfig = (
  raw: RawSolvoConfig = {
    baseUrl: process.env.NEXT_PUBLIC_SOLVO_API_URL,
    chatKey: process.env.NEXT_PUBLIC_SOLVO_CHAT_KEY,
  },
): SolvoConfig | null => {
  const baseUrl = raw.baseUrl?.trim();
  const chatKey = raw.chatKey?.trim();
  if (!baseUrl || !chatKey || !SOLVO_CHAT_KEY_PATTERN.test(chatKey)) return null;
  if (!/^https?:\/\//.test(baseUrl)) return null;
  return { baseUrl, chatKey };
};
