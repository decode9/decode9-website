/** Static, indexable summary of an interactive page (rendered in the server HTML). */
export interface SummaryLink {
  href: string;
  label: string;
}

/** A paragraph mixes plain text and internal links. */
export type SummaryParagraph = readonly (string | SummaryLink)[];

export interface PageSummaryCopy {
  heading: string;
  paragraphs: readonly SummaryParagraph[];
  /** Secondary navigation (legal pages, other sides). */
  links?: readonly SummaryLink[];
}
