import type { CSSProperties } from 'react';

/** Syntax colours of the decode9 design system. */
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
  comment: { color: '#565C65', fontStyle: 'italic' },
  prolog: { color: '#565C65', fontStyle: 'italic' },
  keyword: { color: '#F2474E' },
  'operator.arrow': { color: '#F2474E' },
  function: { color: '#C8CDD4' },
  string: { color: '#1FA85C' },
  char: { color: '#1FA85C' },
  'template-string': { color: '#1FA85C' },
  number: { color: '#E6A23C' },
  boolean: { color: '#E6A23C' },
  'class-name': { color: '#6FB4E6' },
  'maybe-class-name': { color: '#6FB4E6' },
  builtin: { color: '#6FB4E6' },
  constant: { color: '#6FB4E6' },
  punctuation: { color: '#7E8290' },
  operator: { color: '#7E8290' },
};

export default decode9Theme;
