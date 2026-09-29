import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { DEBOUNCE_WAIT_MS, DEBOUNCE_WINDOW_MS, snippetLines } from '@/data/labs';
import type { DebounceEvent } from './interface';

/** Real debounce on the visitor's own typing, plotted on a rolling 5 s timeline. */
const useDebounceDemo = (onHighlight: (lines: readonly number[]) => void) => {
  const [value, setValue] = useState('');
  const [events, setEvents] = useState<DebounceEvent[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [counts, setCounts] = useState({ keys: 0, fires: 0 });
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const sequence = useRef(0);

  const record = useCallback((kind: DebounceEvent['kind']) => {
    sequence.current += 1;
    const event = { id: sequence.current, at: Date.now(), kind };
    setEvents((current) => [...current.filter((item) => event.at - item.at < DEBOUNCE_WINDOW_MS), event]);
    setCounts((current) =>
      kind === 'key' ? { ...current, keys: current.keys + 1 } : { ...current, fires: current.fires + 1 },
    );
  }, []);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      record('key');
      onHighlight(snippetLines.debounce.keystroke);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        record('fire');
        onHighlight(snippetLines.debounce.fire);
      }, DEBOUNCE_WAIT_MS);
    },
    [onHighlight, record],
  );

  useEffect(() => {
    if (events.length === 0) return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 80);
    return () => window.clearInterval(interval);
  }, [events.length]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const positioned = events
    .map((event) => ({ ...event, left: 100 - ((now - event.at) / DEBOUNCE_WINDOW_MS) * 100 }))
    .filter((event) => event.left >= 0);

  return { value, onChange, events: positioned, counts };
};

export default useDebounceDemo;
