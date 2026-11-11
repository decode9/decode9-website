'use client';

import SummaryText from './components/SummaryText';
import usePageSummary from './usePageSummary';
import { withBase } from '@/utils/asset';
import type { PageSummaryProps } from './interface';
import styles from './styles.module.scss';

/**
 * Indexable summary of an interactive page: h1, one or two paragraphs and internal links, in the
 * static HTML. Visually hidden (the client page paints the same copy); see docs/arquitectura.md.
 */
const PageSummary = ({ copy, replaceOnMount = false, children }: PageSummaryProps) => {
  const { showCopy } = usePageSummary(replaceOnMount);

  return (
    <div className={styles.summary} data-seo-summary="">
      {showCopy && (
        <header>
          <h1>{copy.heading}</h1>
          {copy.paragraphs.map((parts, i) => (
            <SummaryText key={i} parts={parts} />
          ))}
          {copy.links && (
            <nav aria-label="Más de decode9">
              {copy.links.map((link) => (
                <a key={link.href} href={withBase(link.href)}>
                  {link.label}{' '}
                </a>
              ))}
            </nav>
          )}
        </header>
      )}
      {children}
    </div>
  );
};

export default PageSummary;
