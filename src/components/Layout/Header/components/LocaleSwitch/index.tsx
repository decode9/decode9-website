import { i18n, LOCALE_COOKIE, localePath } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/utils/cn';
import type { LocaleSwitchProps } from './interface';

const rememberLocale = (locale: string) => {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
  trackEvent('language_change', { locale });
};

/** Each language is its own static page: switching is a navigation, not a re-render. */
const LocaleSwitch = ({ current, label }: LocaleSwitchProps) => (
  <div role="group" aria-label={label} className="flex items-center overflow-hidden rounded-sm border border-ink-700">
    {i18n.locales.map((locale) =>
      locale === current ? (
        <span
          key={locale}
          aria-current="true"
          className="bg-brand-red px-2.5 py-1 font-label text-[11px] font-semibold uppercase tracking-widest text-white"
        >
          {locale}
        </span>
      ) : (
        <a
          key={locale}
          href={localePath(locale)}
          hrefLang={locale}
          lang={locale}
          onClick={() => rememberLocale(locale)}
          className={cn(
            'px-2.5 py-1 font-label text-[11px] font-semibold uppercase tracking-widest text-ink-400',
            'transition-colors hover:bg-ink-800 hover:text-ink-100',
          )}
        >
          {locale}
        </a>
      ),
    )}
  </div>
);

export default LocaleSwitch;
