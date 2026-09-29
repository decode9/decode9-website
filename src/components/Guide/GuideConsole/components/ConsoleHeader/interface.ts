export interface ConsoleHeaderProps {
  name: string;
  statusLabel: string;
  thinking: boolean;
  live: boolean;
  minimizeLabel: string;
  onMinimize: () => void;
  titleId: string;
}
