import { useEffect, useRef } from 'react';

/**
 * requestAnimationFrame loop of the transmitter. Always calls the latest `onFrame` (no restart when
 * the callback identity changes) and stops on unmount or when `active` is false.
 */
const useTransmitterFrame = (onFrame: (time: number) => void, active = true): void => {
  const callback = useRef(onFrame);
  callback.current = onFrame;

  useEffect(() => {
    if (!active) return undefined;
    let id = 0;
    const loop = (time: number) => {
      callback.current(time);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active]);
};

export default useTransmitterFrame;
