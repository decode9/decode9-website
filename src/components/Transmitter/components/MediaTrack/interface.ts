export interface MediaTrackProps {
  media: HTMLMediaElement;
  /** Draw only while the owning sheet/player is visible. */
  active: boolean;
  /** Tall track of the audio sheet. */
  big?: boolean;
  className?: string;
}
