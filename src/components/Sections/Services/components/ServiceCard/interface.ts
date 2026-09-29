import type { Service } from '@/interfaces';

export interface ServiceCopy {
  t: string;
  d: string;
  out: string;
}

export interface ServiceCardProps {
  service: Service;
  copy: ServiceCopy;
  index: number;
  outcomeLabel: string;
  onFocus: (index: number | null) => void;
}
