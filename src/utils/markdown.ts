/**
 * The small markdown dialect the agent writes (ported from Solvo's widget,
 * panel-ia-api/widget/src/markdown.ts): **bold**, WhatsApp-style *bold*,
 * [label](https://…) links, bare http(s) URLs and "-"/"•" bullet lists.
 * It produces an AST rendered as React elements, so nothing the model or a
 * visitor writes is ever injected as HTML.
 */

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] };

export type BlockNode = { type: 'paragraph'; children: InlineNode[] } | { type: 'list'; items: InlineNode[][] };

const INLINE_PATTERN =
  /\*\*(.+?)\*\*|(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:!?)]|$)|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(^|[\s(])(https?:\/\/[^\s<)]+)/g;

const BULLET_PATTERN = /^\s*[-•]\s+(.*)$/;

const text = (value: string): InlineNode[] => (value ? [{ type: 'text', value }] : []);

const nodesForMatch = (match: RegExpMatchArray): InlineNode[] => {
  const [, doubleBold, boldPrefix, singleBold, label, href, urlPrefix, url] = match;
  if (doubleBold !== undefined) return [{ type: 'strong', children: parseInline(doubleBold) }];
  if (singleBold !== undefined) {
    return [...text(boldPrefix ?? ''), { type: 'strong', children: parseInline(singleBold) }];
  }
  if (label !== undefined && href !== undefined) {
    return [{ type: 'link', href, children: text(label) }];
  }
  return [...text(urlPrefix ?? ''), { type: 'link', href: url ?? '', children: text(url ?? '') }];
};

/** Joins adjacent text nodes produced around matches. */
const joinText = (nodes: InlineNode[]): InlineNode[] =>
  nodes.reduce<InlineNode[]>((joined, node) => {
    const previous = joined[joined.length - 1];
    return node.type === 'text' && previous?.type === 'text'
      ? [...joined.slice(0, -1), { type: 'text', value: previous.value + node.value }]
      : [...joined, node];
  }, []);

export const parseInline = (source: string): InlineNode[] => {
  const matches = Array.from(source.matchAll(INLINE_PATTERN));
  const { nodes, cursor } = matches.reduce<{ nodes: InlineNode[]; cursor: number }>(
    (state, match) => {
      const start = match.index ?? 0;
      return {
        nodes: [...state.nodes, ...text(source.slice(state.cursor, start)), ...nodesForMatch(match)],
        cursor: start + match[0].length,
      };
    },
    { nodes: [], cursor: 0 },
  );
  return joinText([...nodes, ...text(source.slice(cursor))]);
};

export const parseMarkdown = (source: string): BlockNode[] =>
  source.split('\n').reduce<BlockNode[]>((blocks, line) => {
    const bullet = BULLET_PATTERN.exec(line);
    const previous = blocks[blocks.length - 1];
    if (bullet) {
      const item = parseInline(bullet[1] ?? '');
      return previous?.type === 'list'
        ? [...blocks.slice(0, -1), { type: 'list', items: [...previous.items, item] }]
        : [...blocks, { type: 'list', items: [item] }];
    }
    return line.trim() ? [...blocks, { type: 'paragraph', children: parseInline(line) }] : blocks;
  }, []);

/** Plain text version (used for aria labels and previews). */
export const toPlainText = (nodes: InlineNode[]): string =>
  nodes.map((node) => (node.type === 'text' ? node.value : toPlainText(node.children))).join('');
