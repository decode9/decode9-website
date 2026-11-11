import type { ReactNode } from 'react';
import type { PortraitImage } from '@/data/transmitter/portraits';
import type { TransmitterStatus } from '@/utils/transmitter';

export interface MainScreenProps {
  active: boolean;
  status: TransmitterStatus;
  station: number;
  portrait: PortraitImage;
  /** Pane contents by station index (phase 3b); missing ones show the intro line. */
  panes?: readonly ReactNode[];
  /** Sheets (video/audio/reader) of phase 3b, above panes and dial. */
  overlays?: ReactNode;
  toastMessage: string;
  toastVisible: boolean;
  onTune: (index: number) => void;
  onClick: () => void;
  onPress: () => void;
  onExit: () => void;
  getTilt: () => number;
}
