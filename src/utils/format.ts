/** Replaces `{key}` placeholders. Unknown keys are left untouched so missing data is visible. */
export const interpolate = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

/** Two-digit, zero-padded index used by the HUD ("02"). */
export const toCode = (index: number): string => String(index).padStart(2, '0');

/** "mm:ss" countdown label. */
export const formatCountdown = (milliseconds: number): string => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};
