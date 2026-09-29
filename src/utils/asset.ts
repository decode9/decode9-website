const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefixes public asset paths with the deploy base path (empty on decode9.codes). */
export const withBase = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
