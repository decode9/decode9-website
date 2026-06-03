'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import type { CSSProperties } from 'react';

// Token colors matching the design system (design-template/Decode9 Website/assets/css/site.css)
const decode9Theme: Record<string, CSSProperties> = {
  'pre[class*="language-"]': {
    color: '#C8CDD4',
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0,
    overflow: 'auto',
    whiteSpace: 'pre',
  },
  'code[class*="language-"]': {
    color: '#C8CDD4',
    background: 'none',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
    whiteSpace: 'pre',
  },
  comment:             { color: '#565C65', fontStyle: 'italic' },
  prolog:              { color: '#565C65', fontStyle: 'italic' },
  keyword:             { color: '#F2474E' },
  'operator.arrow':    { color: '#F2474E' },
  function:            { color: '#C8CDD4' },
  'function.maybe-class-name': { color: '#C8CDD4' },
  string:              { color: '#1FA85C' },
  char:                { color: '#1FA85C' },
  'template-string':   { color: '#1FA85C' },
  number:              { color: '#E6A23C' },
  boolean:             { color: '#E6A23C' },
  'class-name':        { color: '#6FB4E6' },
  'maybe-class-name':  { color: '#6FB4E6' },
  builtin:             { color: '#6FB4E6' },
  constant:            { color: '#6FB4E6' },
  punctuation:         { color: '#7E8290' },
  operator:            { color: '#7E8290' },
};

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', showLineNumbers = false }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={decode9Theme}
      customStyle={{
        margin: 0,
        padding: '1.25rem 1.5rem',
        background: 'transparent',
        fontSize: '12.5px',
        lineHeight: '1.5rem',
        overflowX: 'auto',
        maxWidth: '100%',
      }}
      showLineNumbers={showLineNumbers}
      lineNumberStyle={{
        color: '#4a5568',
        paddingRight: '1rem',
        minWidth: '2.5rem',
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

