import { useMemo } from 'react';
import { parseMarkdown } from '@/utils/markdown';
import InlineNodes from './components/InlineNodes';
import type { MarkdownProps } from './interface';

const Markdown = ({ source }: MarkdownProps) => {
  const blocks = useMemo(() => parseMarkdown(source), [source]);

  return (
    <>
      {blocks.map((block, index) =>
        block.type === 'paragraph' ? (
          <p key={index}>
            <InlineNodes nodes={block.children} />
          </p>
        ) : (
          <ul key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <InlineNodes nodes={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </>
  );
};

export default Markdown;
