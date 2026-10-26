import Image from 'next/image';
import LocaleSwitch from '@/components/Layout/Header/components/LocaleSwitch';
import { CONTACT } from '@/data/contact';
import { LEGAL_ENTITY, legalPath, legalUrl, type LegalKind } from '@/data/legal';
import { getDictionary, localePath, SITE_URL, type Locale } from '@/i18n';
import { withBase } from '@/utils/asset';
import type { LegalDocumentProps } from './interface';

const linkClass =
  'text-ink-100 underline decoration-ink-600 underline-offset-4 transition-colors hover:decoration-brand-red';

interface Fact {
  id: string;
  term: string;
  value: string;
  href?: string;
  external?: boolean;
  emphasis?: 'name' | 'cuil';
}

const factValue = (fact: Fact) => {
  if (!fact.href) return fact.value;
  return (
    <a
      href={fact.href}
      className={linkClass}
      target={fact.external ? '_blank' : undefined}
      rel={fact.external ? 'noopener noreferrer' : undefined}
    >
      {fact.value}
    </a>
  );
};

const valueClass = (fact: Fact): string => {
  if (fact.emphasis === 'cuil') return 'mt-1 font-code text-lg text-ink-50';
  if (fact.emphasis === 'name') return 'mt-1 font-heading text-2xl font-semibold tracking-tight text-ink-50';
  return 'd9-label mt-1';
};

const buildJsonLd = (locale: Locale, kind: LegalKind, title: string) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: legalUrl(locale, kind),
    inLanguage: locale,
    publisher: {
      '@type': 'Person',
      name: LEGAL_ENTITY.name,
      taxID: LEGAL_ENTITY.cuil,
      email: CONTACT.email,
      telephone: '+1-786-531-8494',
      url: SITE_URL,
    },
  });

/** A readable legal page. It does not mount the guided session. */
const LegalDocument = ({ locale, kind }: LegalDocumentProps) => {
  const dictionary = getDictionary(locale);
  const copy = dictionary.legal;
  const page = copy[kind];
  const facts: Fact[] = [
    { id: 'name', term: copy.legalName, value: LEGAL_ENTITY.name, emphasis: 'name' },
    { id: 'cuil', term: copy.cuil, value: LEGAL_ENTITY.cuil, emphasis: 'cuil' },
    { id: 'brand', term: copy.brand, value: LEGAL_ENTITY.brand },
    { id: 'website', term: copy.website, value: SITE_URL, href: localePath(locale) },
    { id: 'email', term: copy.email, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { id: 'whatsapp', term: copy.whatsapp, value: CONTACT.whatsapp, href: CONTACT.whatsappUrl, external: true },
  ];
  const navLink = 'd9-caption text-ink-300 transition-colors hover:text-ink-50';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(locale, kind, page.metaTitle) }}
      />
      <header className="border-b border-ink-800 bg-ink-950">
        <div className="d9-container-wide flex h-[var(--header-h)] items-center justify-between gap-4">
          <a href={localePath(locale)} aria-label={dictionary.nav.home} className="flex-shrink-0">
            <Image src={withBase('/brand/decode9-logo.png')} alt="decode9" width={120} height={26} priority />
          </a>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href={localePath(locale)} className={`${navLink} hidden sm:inline`}>
              {copy.back}
            </a>
            <LocaleSwitch
              current={locale}
              label={dictionary.nav.language}
              hrefs={{ en: legalPath('en', kind), es: legalPath('es', kind) }}
            />
          </div>
        </div>
      </header>

      <main id="main" className="d9-container max-w-3xl py-16 sm:py-20">
        <p className="d9-eyebrow">{page.kicker}</p>
        <h1 className="d9-h1 mb-4">{page.title}</h1>
        <p className="d9-caption mb-8">
          {copy.updatedLabel} {copy.updated}
        </p>
        <p className="d9-body-lg mb-10">{page.lead}</p>

        <section aria-labelledby="legal-operator" className="mb-14 border border-ink-700 bg-ink-900 p-6 sm:p-8">
          <h2 id="legal-operator" className="d9-h3 mb-6">
            {copy.operator}
          </h2>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.id} className={fact.emphasis ? 'sm:col-span-2' : undefined}>
                <dt className="d9-mono-label">{fact.term}</dt>
                <dd className={valueClass(fact)} data-legal={fact.id}>
                  {factValue(fact)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex flex-col gap-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="d9-h4 mb-3">{section.heading}</h2>
              <div className="flex flex-col gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="d9-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav
          aria-label={dictionary.footer.legal}
          className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink-800 pt-6"
        >
          <a
            href={legalPath(locale, 'privacy')}
            aria-current={kind === 'privacy' ? 'page' : undefined}
            className={navLink}
          >
            {dictionary.footer.privacy}
          </a>
          <a
            href={legalPath(locale, 'terms')}
            aria-current={kind === 'terms' ? 'page' : undefined}
            className={navLink}
          >
            {dictionary.footer.terms}
          </a>
          <a href={localePath(locale)} className={navLink}>
            {copy.back}
          </a>
        </nav>
      </main>

      <footer className="border-t border-ink-800">
        <div className="d9-container-wide py-5">
          <span className="d9-caption">{dictionary.footer.rights}</span>
        </div>
      </footer>
    </>
  );
};

export default LegalDocument;
