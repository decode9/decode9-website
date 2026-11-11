/** Languages of the legal pages (the rest of the site is Spanish only). */
export type LegalLocale = 'es' | 'en';

export type LegalKind = 'privacy' | 'terms';

/** Public identity of the person who operates decode9.codes (Meta Business verification). */
export interface LegalEntity {
  name: string;
  cuil: string;
  brand: string;
  website: string;
  email: string;
  whatsapp: string;
  whatsappUrl: string;
}

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalPage {
  kicker: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  sections: LegalSection[];
}

/** Interface strings around the legal text. */
export interface LegalLabels {
  back: string;
  updatedLabel: string;
  operator: string;
  legalName: string;
  cuil: string;
  brand: string;
  website: string;
  email: string;
  whatsapp: string;
  legalNav: string;
  privacy: string;
  terms: string;
  rights: string;
  otherLanguage: string;
}

export interface LegalCopy {
  labels: LegalLabels;
  updated: string;
  privacy: LegalPage;
  terms: LegalPage;
}
