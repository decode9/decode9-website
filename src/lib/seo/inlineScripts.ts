import { LOCALE_COOKIE } from '@/i18n/routes';

/** Home routes of the guided session. Legal pages must not arm the preloader. */
export const SESSION_PATH = /^\/(es\/)?$/;

/**
 * Runs before first paint. On the session routes only, turns the preloader on
 * (not under reduced motion, and with a safety timeout) and marks returning
 * visitors for a shorter opening. On the English home, sends first-time
 * Spanish-speaking visitors to /es/ unless they already chose a language.
 */
export const bootScript = (redirectSpanish: boolean): string => `(function(){try{
var d=document.documentElement;
var session=/${SESSION_PATH.source}/.test(location.pathname);
if(session&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.loading='on';setTimeout(function(){delete d.dataset.loading;},12000);}
var seen=null;
if(session){try{seen=localStorage.getItem('d9-session-seen');localStorage.setItem('d9-session-seen','1');}catch(e){}}
d.dataset.boot=seen?'short':'full';
${
  redirectSpanish
    ? `if(!/(?:^|; )${LOCALE_COOKIE}=/.test(document.cookie)&&/^es\\b/i.test(navigator.language||'')&&location.pathname==='/'){location.replace('/es/'+location.search+location.hash);}`
    : ''
}
}catch(e){}})();`;

export const gtagScript = (gaId: string): string => `window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${gaId}');`;
