import { useState, useEffect } from 'react';

interface UseTypingEffectOptions {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  loopDelay?: number;
}

export function useTypingEffect({
  text,
  speed = 50,
  delay = 0,
  loop = false,
  loopDelay = 2000,
}: UseTypingEffectOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;

    const startTyping = () => {
      setIsTyping(true);
      setIsComplete(false);
      setDisplayedText('');
      currentIndex = 0;

      const type = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(type, speed);
        } else {
          setIsTyping(false);
          setIsComplete(true);

          if (loop) {
            timeout = setTimeout(() => {
              setDisplayedText('');
              currentIndex = 0;
              startTyping();
            }, loopDelay);
          }
        }
      };

      timeout = setTimeout(type, delay);
    };

    startTyping();

    return () => clearTimeout(timeout);
  }, [text, speed, delay, loop, loopDelay]);

  return { displayedText, isTyping, isComplete };
}

