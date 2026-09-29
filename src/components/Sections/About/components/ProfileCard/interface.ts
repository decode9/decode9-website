export interface ProfileRow {
  k: string;
  v: string;
}

export interface ProfileCardProps {
  title: string;
  rows: ProfileRow[];
}
