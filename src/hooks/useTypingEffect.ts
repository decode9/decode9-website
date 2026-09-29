import { useEffect, useState } from 'react';

interface UseTypingEffectOptions {
  text: string;
  /** Milliseconds between steps. */
  speed?: number;
  /** Characters revealed per step. */
  step?: number;
  delay?: number;
  /** When false the full text is shown immediately (reduced motion, old messages). */
  enabled?: boolean;
}

interface UseTypingEffectReturn {
  displayedText: string;
  isTyping: boolean;
  isComplete: boolean;
}

const useTypingEffect = ({
  text,
  speed = 18,
  step = 2,
  delay = 0,
  enabled = true,
}: UseTypingEffectOptions): UseTypingEffectReturn => {
  const [count, setCount] = useState(enabled ? 0 : text.length);

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return undefined;
    }
    setCount(0);
    let revealed = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      revealed = Math.min(text.length, revealed + step);
      setCount(revealed);
      if (revealed < text.length) timer = setTimeout(tick, speed);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [text, speed, step, delay, enabled]);

  return {
    displayedText: text.slice(0, count),
    isTyping: count < text.length,
    isComplete: count >= text.length,
  };
};

export default useTypingEffect;
