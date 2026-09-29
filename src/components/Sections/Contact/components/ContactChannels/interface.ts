export interface ContactChannelsProps {
  labels: { email: string; github: string; linkedin: string };
  onSelect: (channel: string) => void;
}
