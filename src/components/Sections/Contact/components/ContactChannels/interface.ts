export interface ContactChannelsProps {
  labels: { email: string; whatsapp: string; github: string; linkedin: string };
  onSelect: (channel: string) => void;
}
