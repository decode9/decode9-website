/**
 * Downloads a list of files while measuring real bytes, so a progress bar reflects the actual
 * transfer. Responses are requested with cache:'force-cache' so the destination opens from cache.
 */
export interface BytePreloaderDeps {
  fetch: typeof fetch;
  /** Size assumed when a response has no content-length. */
  fallbackSize?: number;
}

export interface BytePreloader {
  /** Resolves when every file finished or failed; onProgress gets 0–1. */
  preload: (files: readonly string[], onProgress: (p: number) => void) => Promise<void>;
  /** Aborts pending downloads. */
  dispose: () => void;
}

export const createBytePreloader = ({ fetch: doFetch, fallbackSize = 200000 }: BytePreloaderDeps): BytePreloader => {
  const controller = new AbortController();

  const preload: BytePreloader['preload'] = async (files, onProgress) => {
    const sizes = files.map(() => 0);
    const got = files.map(() => 0);
    const report = () => {
      const total = sizes.reduce((a, b) => a + b, 0);
      const loaded = got.reduce((a, b) => a + b, 0);
      onProgress(total ? loaded / total : 0);
    };
    await Promise.all(
      files.map(async (url, i) => {
        try {
          const res = await doFetch(url, { cache: 'force-cache', signal: controller.signal });
          sizes[i] = Number(res.headers.get('content-length')) || fallbackSize;
          if (!res.body) {
            await res.arrayBuffer();
            got[i] = sizes[i];
            report();
            return;
          }
          const reader = res.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            got[i] += value.length;
            report();
          }
          got[i] = sizes[i] = Math.max(sizes[i], got[i]);
          report();
        } catch {
          sizes[i] = got[i] = 1;
          report();
        }
      }),
    );
  };

  return { preload, dispose: () => controller.abort() };
};
