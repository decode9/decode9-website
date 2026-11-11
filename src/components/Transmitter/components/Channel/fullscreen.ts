type FullscreenDocument = Document & { webkitFullscreenElement?: Element; webkitExitFullscreen?: () => Promise<void> };
type FullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
type LockableOrientation = ScreenOrientation & { lock?: (o: string) => Promise<void> };

/** Browser fullscreen + landscape lock, ignoring unsupported APIs (original openFs/closeFs). */
export const requestFullscreen = (el: HTMLElement | null) => {
  const target = el as FullscreenElement | null;
  try {
    const request = target?.requestFullscreen ?? target?.webkitRequestFullscreen;
    request?.call(target)?.catch?.(() => undefined);
  } catch {
    /* unsupported */
  }
  try {
    (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape').catch(() => undefined);
  } catch {
    /* unsupported */
  }
};

export const exitFullscreen = () => {
  const doc = document as FullscreenDocument;
  try {
    if (doc.fullscreenElement || doc.webkitFullscreenElement) (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(doc);
  } catch {
    /* unsupported */
  }
  try {
    screen.orientation?.unlock();
  } catch {
    /* unsupported */
  }
};
