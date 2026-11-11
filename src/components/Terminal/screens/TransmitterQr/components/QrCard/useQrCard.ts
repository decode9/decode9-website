'use client';

import { useEffect, useRef, useState } from 'react';
import type { QrCardProps } from './interface';

/** Paints the QR once and handles "copy link" (original d9QR). */
const useQrCard = ({ url, drawQr }: QrCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) setFailed(!drawQr(canvasRef.current, url));
  }, [drawQr, url]);

  const copy = () => {
    try {
      navigator.clipboard.writeText(url).then(
        () => setCopied(true),
        () => undefined,
      );
    } catch {
      /* clipboard unavailable: the link stays visible */
    }
  };

  return { canvasRef, failed, copied, copy };
};

export default useQrCard;
