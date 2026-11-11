import type { LegalDocumentProps, LegalFact } from './interface';
import useLegalDocument from './useLegalDocument';
import styles from './styles.module.scss';

const FactValue = ({ fact }: { fact: LegalFact }) =>
  fact.href ? (
    <a
      href={fact.href}
      target={fact.external ? '_blank' : undefined}
      rel={fact.external ? 'noopener noreferrer' : undefined}
    >
      {fact.value}
    </a>
  ) : (
    <>{fact.value}</>
  );

/**
 * Readable legal page (privacy / terms, ES or EN). The root layout is Spanish only, so the
 * document carries its own `lang`: English pages are marked at the container.
 */
const LegalDocument = ({ locale, kind, jsonLd }: LegalDocumentProps) => {
  const { labels, page, updated, facts, documents, home, translation } = useLegalDocument(locale, kind);

  return (
    <div className={styles.root} lang={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <header className={styles.bar}>
        <a href={home} className={styles.brand}>
          decode9
        </a>
        <nav className={styles.barNav}>
          <a href={home}>← {labels.back}</a>
          <a href={translation.href} hrefLang={translation.lang} lang={translation.lang}>
            {translation.label}
          </a>
        </nav>
      </header>

      <main className={styles.main}>
        <p className={styles.kicker}>{page.kicker}</p>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.updated}>
          {labels.updatedLabel} {updated}
        </p>
        <p className={styles.lead}>{page.lead}</p>

        <section aria-labelledby="legal-operator" className={styles.card}>
          <h2 id="legal-operator" className={styles.cardTitle}>
            {labels.operator}
          </h2>
          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.id} className={fact.emphasis ? styles.factWide : undefined}>
                <dt>{fact.term}</dt>
                <dd data-legal={fact.id} data-emphasis={fact.emphasis ? fact.id : undefined}>
                  <FactValue fact={fact} />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className={styles.sections}>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <nav aria-label={labels.legalNav} className={styles.footNav}>
          {documents.map((doc) => (
            <a key={doc.href} href={doc.href} aria-current={doc.current ? 'page' : undefined}>
              {doc.label}
            </a>
          ))}
          <a href={home}>{labels.back}</a>
        </nav>
      </main>

      <footer className={styles.foot}>{labels.rights}</footer>
    </div>
  );
};

export default LegalDocument;
