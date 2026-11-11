'use client';

import { useEffect, useRef, useState } from 'react';
import { DIAL_BARS, TX_LOG, type TxLine } from '@/data/terminal/channel';
import { dialHeight, dialLit, drawTxWave } from '@/lib/canvas/txWave';
import type { RadioProps } from './interface';

/** Wave, dial and log of the «Enlace» transmitter (original initCanal tk + txlog). */
const useRadio = ({ bus }: RadioProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Array<TxLine & { id: number }>>([]);

  useEffect(() => {
    let id = 0;
    const off = bus.subscribe((line) => {
      id += 1;
      const key = id;
      setLines((l) => [...l, { ...line, id: key }]);
    });
    const cancel = bus.log(TX_LOG.open);
    return () => {
      cancel();
      off();
    };
  }, [bus]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const amp = bus.amp();
      if (canvasRef.current) drawTxWave(canvasRef.current, t, amp);
      const bars = dialRef.current?.children;
      if (bars) {
        const on = dialLit(bars.length, t, amp);
        for (let k = 0; k < bars.length; k += 1) {
          const b = bars[k] as HTMLElement;
          b.dataset.on = k < on ? '1' : '';
          b.style.height = `${dialHeight(k, t, amp)}%`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bus]);

  return { canvasRef, dialRef, logRef, lines, bars: DIAL_BARS };
};

export default useRadio;
