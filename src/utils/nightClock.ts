/**
 * Night mode clock of /perfil/ (L2138–2152 of the original): it follows Argentina's time,
 * wherever the visitor is. Night runs from 20:00 to 07:00. `?hora=23` forces an hour.
 */
export const NIGHT_START = 20;
export const NIGHT_END = 7;

const AR_TIME_ZONE = 'America/Argentina/Buenos_Aires';
/** Argentina is UTC-3 with no daylight saving time. */
const AR_UTC_OFFSET = -3;

/** Hour (0–23) in Argentina at `date`. */
export const argentinaHour = (date: Date = new Date()): number => {
  try {
    const h = new Intl.DateTimeFormat('en-US', { timeZone: AR_TIME_ZONE, hour: 'numeric', hourCycle: 'h23' }).format(date);
    return Number(h) % 24;
  } catch {
    return (date.getUTCHours() + 24 + AR_UTC_OFFSET) % 24;
  }
};

export const isNightHour = (hour: number): boolean => hour >= NIGHT_START || hour < NIGHT_END;

/** `?hora=` as a number (same rule as the original: any non-empty numeric value), else null. */
export const parseHourParam = (search: string): number | null => {
  const q = new URLSearchParams(search).get('hora');
  if (q === null || q.trim() === '') return null;
  const h = Number(q);
  return Number.isNaN(h) ? null : h;
};

/** Hour that decides the night mode on load: `?hora=` if present, else Argentina's hour. */
export const resolveNightHour = (search: string, date: Date = new Date()): number => parseHourParam(search) ?? argentinaHour(date);

/** `?sim=1` shows the temporary hour simulator. */
export const showsNightSimulator = (search: string): boolean => new URLSearchParams(search).get('sim') === '1';
