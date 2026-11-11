import { DECODE_CHARSET } from '@/data/terminal/glyphs';

/**
 * One frame of the "decoding" effect: the first `progress` share of the text is revealed,
 * the rest is random charset noise (spaces and line breaks are kept).
 */
export const scrambleFrame = (
  original: string,
  progress: number,
  random: () => number = Math.random,
  charset: string = DECODE_CHARSET,
): string => {
  const k = Math.max(0, Math.min(1, progress));
  const revealed = Math.floor(k * original.length);
  let out = '';
  for (let i = 0; i < original.length; i += 1) {
    const c = original[i];
    out += i < revealed || c === ' ' || c === '\n' ? c : charset[Math.floor(random() * charset.length)];
  }
  return out;
};

/** Progress of one text node: each node starts after its own delay (0..0.35) and takes 65% of the run. */
export const nodeProgress = (elapsed: number, delay: number): number => Math.max(0, Math.min(1, (elapsed - delay) / 0.65));

interface DecodeItem {
  node: Text;
  original: string;
  delay: number;
}

const running = new WeakMap<Element, () => void>();

/**
 * Scrambles every text node inside `el` and reveals it over `duration` ms (original decodeText).
 * Restores the exact text at the end or when cancelled. Returns the cancel function.
 */
export const decodeText = (
  el: Element | null | undefined,
  duration = 700,
  options: { reduceMotion?: boolean; random?: () => number } = {},
): (() => void) => {
  const noop = () => undefined;
  if (!el || options.reduceMotion || typeof document === 'undefined') return noop;
  const random = options.random ?? Math.random;
  running.get(el)?.();

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const items: DecodeItem[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n as Text;
    if (/\S/.test(text.nodeValue ?? '')) items.push({ node: text, original: text.nodeValue ?? '', delay: random() * 0.35 });
  }

  const restore = () => items.forEach((it) => (it.node.nodeValue = it.original));
  const t0 = performance.now();
  const timer = window.setInterval(() => {
    const elapsed = (performance.now() - t0) / duration;
    items.forEach((it) => (it.node.nodeValue = scrambleFrame(it.original, nodeProgress(elapsed, it.delay), random)));
    if (elapsed >= 1) cancel();
  }, 40);

  function cancel() {
    window.clearInterval(timer);
    restore();
    if (running.get(el as Element) === cancel) running.delete(el as Element);
  }
  running.set(el, cancel);
  return cancel;
};
