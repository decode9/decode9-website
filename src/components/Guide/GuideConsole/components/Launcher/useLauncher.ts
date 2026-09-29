import { useCallback, useEffect, useState } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import useTypingEffect from '@/hooks/useTypingEffect';

const CAPTION_MS = 7000;

/**
 * The collapsed guide types each new narration line like a live caption, then
 * tucks itself into its avatar so it doesn't sit on top of the content.
 */
const useLauncher = (subtitle: string) => {
  const reducedMotion = useReducedMotion();
  const [captioning, setCaptioning] = useState(true);
  const [hovered, setHovered] = useState(false);
  const typing = useTypingEffect({ text: subtitle, speed: 22, step: 1, delay: 150, enabled: !reducedMotion });

  useEffect(() => {
    setCaptioning(true);
    const timer = window.setTimeout(() => setCaptioning(false), CAPTION_MS);
    return () => window.clearTimeout(timer);
  }, [subtitle]);

  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);

  return { ...typing, expanded: captioning || hovered, onEnter, onLeave };
};

export default useLauncher;
