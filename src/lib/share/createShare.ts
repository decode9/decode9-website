/** What can be shared: a channel item (its id becomes the URL hash). */
export interface Shareable {
  id: string;
  title: string;
}

/** `shared`: native sheet used · `copied`: link copied (show "ENLACE COPIADO") · `failed`: cancelled/unsupported. */
export type ShareOutcome = 'shared' | 'copied' | 'failed';

export interface ShareDeps {
  /** Base URL of the shared links (original D9M.shareBase); its hash is dropped. */
  base: string;
  navigator: Pick<Navigator, 'share' | 'clipboard'> | undefined;
}

/** `${base}#${id}` (original shareURL). */
export const shareUrl = (base: string, id: string): string => `${base.replace(/#.*$/, '')}#${id}`;

/**
 * Share adapter of the transmitter: navigator.share when available, clipboard otherwise.
 * Never throws (a cancelled native sheet is `failed`, like the original's silent catch).
 */
const createShare =
  ({ base, navigator: nav }: ShareDeps) =>
  async (item: Shareable): Promise<ShareOutcome> => {
    const url = shareUrl(base, item.id);
    try {
      if (nav && typeof nav.share === 'function') {
        await nav.share({ title: item.title, text: `decode9 · ${item.title}`, url });
        return 'shared';
      }
      if (!nav?.clipboard) return 'failed';
      await nav.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  };

export default createShare;
