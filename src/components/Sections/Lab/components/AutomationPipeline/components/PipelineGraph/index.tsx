import { cn } from '@/utils/cn';
import type { PipelineGraphProps } from './interface';

const NODE_X = [100, 300, 500, 700, 900];
const Y = 70;
const HALF = 56;

const notchedNode = (x: number) =>
  `M ${x - HALF} ${Y - 26} H ${x + HALF - 12} L ${x + HALF} ${Y - 14} V ${Y + 26} H ${x - HALF} Z`;

const link = (from: number, to: number) =>
  `M ${from + HALF} ${Y} C ${from + HALF + 50} ${Y - 40}, ${to - HALF - 50} ${Y + 40}, ${to - HALF} ${Y}`;

/**
 * Five stages joined by links. Each link has a dashed base and a solid "live"
 * stroke on top that GSAP draws while the packet travels it — React never
 * touches those strokes, so the two can't fight over dash styles.
 */
const PipelineGraph = ({ labels, activeNode }: PipelineGraphProps) => (
  <div>
    <svg viewBox="0 0 1000 140" className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <filter id="pipe-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {NODE_X.slice(0, -1).map((x, index) => (
        <g key={x}>
          <path
            data-pipe-path={index}
            d={link(x, NODE_X[index + 1]!)}
            fill="none"
            stroke="#3D4049"
            strokeWidth={2}
            strokeDasharray="6 6"
          />
          <path
            data-pipe-live={index}
            d={link(x, NODE_X[index + 1]!)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            filter="url(#pipe-glow)"
            style={{ strokeDasharray: '0 99999' }}
          />
        </g>
      ))}
      {NODE_X.map((x, index) => (
        <g key={x} data-pipe-node={index}>
          <path
            d={notchedNode(x)}
            fill={index <= activeNode ? 'rgba(229, 18, 27, 0.16)' : 'rgba(24, 25, 28, 0.9)'}
            stroke={index <= activeNode ? 'var(--accent)' : '#3D4049'}
            strokeWidth={1.5}
            style={{ transition: 'fill 300ms ease, stroke 300ms ease' }}
          />
          <text x={x} y={Y + 7} textAnchor="middle" className="fill-ink-100 font-code" fontSize="20">
            {String(index + 1).padStart(2, '0')}
          </text>
        </g>
      ))}
      <circle
        data-packet
        r={8}
        cx={0}
        cy={0}
        fill="var(--accent)"
        filter="url(#pipe-glow)"
        style={{ visibility: 'hidden' }}
      />
    </svg>
    <ol className="grid grid-cols-5 text-center">
      {labels.map((label, index) => (
        <li
          key={label}
          className={cn(
            'px-1 text-[11px] leading-tight transition-colors duration-300 sm:text-[13px]',
            index <= activeNode ? 'text-ink-50' : 'text-ink-400',
          )}
        >
          {label}
        </li>
      ))}
    </ol>
  </div>
);

export default PipelineGraph;
