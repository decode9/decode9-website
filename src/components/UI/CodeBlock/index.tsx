'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', showLineNumbers = true }: CodeBlockProps) {
  return (
    // @ts-expect-error - SyntaxHighlighter types are incorrect
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '1.5rem',
        background: 'transparent',
        fontSize: '0.875rem',
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

