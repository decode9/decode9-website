'use client';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import type { CodeBlockProps } from './interface';
import decode9Theme from './theme';

SyntaxHighlighter.registerLanguage('typescript', typescript);

const CodeBlock = ({ code, highlightLines = [] }: CodeBlockProps) => (
  <SyntaxHighlighter
    language="typescript"
    style={decode9Theme}
    wrapLines
    lineProps={(line: number) => ({
      style: {
        display: 'block',
        transition: 'background 180ms ease',
        background: highlightLines.includes(line) ? 'rgba(229, 18, 27, 0.14)' : 'transparent',
        boxShadow: highlightLines.includes(line) ? 'inset 2px 0 0 var(--brand-red)' : 'none',
      },
    })}
    customStyle={{
      margin: 0,
      padding: '1.1rem 1.25rem',
      background: 'transparent',
      fontSize: '12.5px',
      lineHeight: '1.45rem',
      overflowX: 'auto',
      maxWidth: '100%',
    }}
  >
    {code}
  </SyntaxHighlighter>
);

export default CodeBlock;
