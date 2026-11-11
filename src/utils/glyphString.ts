/** Random glyph string with a space every fifth char (original gstr). */
export const glyphString = (length: number, alphabet: string, random: () => number = Math.random): string => {
  let out = '';
  for (let i = 0; i < length; i += 1) out += i % 5 === 4 ? ' ' : alphabet[Math.floor(random() * alphabet.length)];
  return out;
};
