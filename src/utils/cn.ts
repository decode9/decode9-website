type ClassValue = string | number | boolean | undefined | null | ClassValue[];
type ClassDictionary = Record<string, boolean | undefined | null>;

/** Joins conditional class names: strings, arrays and `{ class: condition }` objects. */
export const cn = (...inputs: (ClassValue | ClassDictionary)[]): string =>
  inputs
    .flatMap((input): string[] => {
      if (!input) return [];
      if (typeof input === 'string' || typeof input === 'number') return [String(input)];
      if (Array.isArray(input)) return [cn(...input)].filter(Boolean);
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([, enabled]) => Boolean(enabled))
          .map(([name]) => name);
      }
      return [];
    })
    .join(' ');
