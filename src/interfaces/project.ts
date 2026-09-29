export type ProjectId = 'the-empire' | 'solvo' | 'desaparecidos' | 'finami' | 'latin-freedom' | 'patilla-games';

export type ProjectStatus = 'live' | 'private' | 'building';

export interface BrandLogo {
  src: string;
  width: number;
  height: number;
  /** `round` marks without transparency are shown inside a circular mask. */
  shape: 'wordmark' | 'round';
}

export interface BrandIdentity {
  primary: string;
  background: string;
  secondary?: string;
  logo: BrandLogo;
}

export interface CaseStudy {
  id: ProjectId;
  name: string;
  url?: string;
  poweredByEmpire: boolean;
  since: number;
  status: ProjectStatus;
  brand: BrandIdentity;
  media: {
    desktop: string;
    mobile?: string;
  };
  stack: string[];
}

export type AlsoBuiltId = 'globalrec' | 'yujju' | 'miuniforme' | 'academy';

export interface AlsoBuilt {
  id: AlsoBuiltId;
  name: string;
  url?: string;
  tags: string[];
}
