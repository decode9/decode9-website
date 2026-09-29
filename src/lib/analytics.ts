declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_ID = 'G-VMLFSX6GXW';

/** Sends a GA4 event. Never pass visitor-written text (messages, names, emails) as params. */
export const trackEvent = (action: string, params?: Record<string, string | number | boolean>): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
};
