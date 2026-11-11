/** Players of the Canal screen: playing one pauses the rest (original pauseAllMedia). */
export interface MediaGroup {
  add: (media: HTMLMediaElement) => () => void;
  /** Pauses every player except `except`. */
  pauseAll: (except?: HTMLMediaElement | null) => void;
}

export const createMediaGroup = (): MediaGroup => {
  const players = new Set<HTMLMediaElement>();
  return {
    add: (media) => {
      players.add(media);
      return () => {
        players.delete(media);
      };
    },
    pauseAll: (except) => {
      players.forEach((m) => {
        if (m !== except && !m.paused) m.pause();
      });
    },
  };
};
