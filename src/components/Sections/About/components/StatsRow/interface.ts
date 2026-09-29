export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface StatsRowProps {
  stats: Stat[];
}
