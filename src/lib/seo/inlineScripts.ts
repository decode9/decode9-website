import { LOCALE_COOKIE } from '@/i18n/routes';

/**
 * Runs before first paint. Turns the preloader on (not under reduced motion,
 * and with a safety timeout), marks returning visitors for a shorter opening
 * and, on the English page only, sends first-time Spanish-speaking visitors to
 * /es/ unless they already chose a language.
 */
export const bootScript = (redirectSpanish: boolean): string => `(function(){try{
var d=document.documentElement;
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.loading='on';setTimeout(function(){delete d.dataset.loading;},12000);}
var seen=null;try{seen=localStorage.getItem('d9-session-seen');localStorage.setItem('d9-session-seen','1');}catch(e){}
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
