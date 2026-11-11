import { withBase } from '@/utils/asset';
import type { SummaryTextProps } from './interface';

/** One paragraph of text and internal links. */
const SummaryText = ({ parts }: SummaryTextProps) => (
  <p>
    {parts.map((part, i) =>
      typeof part === 'string' ? (
        part
      ) : (
        <a key={`${part.href}-${i}`} href={withBase(part.href)}>
          {part.label}
        </a>
      ),
    )}
  </p>
);

export default SummaryText;
