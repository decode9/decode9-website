export interface LauncherProps {
  name: string;
  subtitle: string;
  openLabel: string;
  thinking: boolean;
  live: boolean;
  onOpen: () => void;
}
