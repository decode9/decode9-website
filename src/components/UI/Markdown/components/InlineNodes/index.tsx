import type { InlineNodesProps } from './interface';

/** Renders parsed inline markdown as React elements — never as HTML strings. */
const InlineNodes = ({ nodes }: InlineNodesProps) => (
  <>
    {nodes.map((node, index) => {
      if (node.type === 'text') return <span key={index}>{node.value}</span>;
      if (node.type === 'strong') {
        return (
          <strong key={index}>
            <InlineNodes nodes={node.children} />
          </strong>
        );
      }
      return (
        <a key={index} href={node.href} target="_blank" rel="noopener noreferrer">
          <InlineNodes nodes={node.children} />
        </a>
      );
    })}
  </>
);

export default InlineNodes;
