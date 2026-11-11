import { useEffect, useState } from 'react';
import { CALL_TEXT } from '@/data/transmitter/callScript';
import { MONTHS, WEEKDAYS } from '@/data/transmitter/calendar';
import { formatLockDate, formatLockTime } from '@/utils/transmitter';
import type { UseLockScreenReturn } from './interface';

const CLOCK_MS = 10000;

const readClock = () => {
  const now = new Date();
  return { ...formatLockTime(now), date: formatLockDate(now, WEEKDAYS, MONTHS) };
};

/** Lock screen clock (refreshed every 10 s, like the original) and the linked tag. */
const useLockScreen = (alias: string): UseLockScreenReturn => {
  const [clock, setClock] = useState(readClock);

  useEffect(() => {
    const id = setInterval(() => setClock(readClock()), CLOCK_MS);
    return () => clearInterval(id);
  }, []);

  return { ...clock, tag: alias ? CALL_TEXT.linkedTag(alias) : CALL_TEXT.tag };
};

export default useLockScreen;
