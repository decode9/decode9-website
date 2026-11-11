import { STATION_ICONS } from '@/data/transmitter/icons';
import shared from '../../shared.module.scss';
import useDial from './useDial';
import type { DialProps } from './interface';
import styles from './styles.module.scss';

/** Rotary channel dial (#dial): hexagon stations on a graduated ring, needle on top. */
const Dial = (props: DialProps) => {
  const { dialRef, wobbleRef, rotorRef, setUprightRef, ticks, stations, hexagon, freq, name, live, ...handlers } =
    useDial(props);
  return (
    <div
      ref={dialRef}
      className={styles.dial}
      tabIndex={0}
      aria-label="Dial de canales: usa las flechas para cambiar"
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onPointerCancel={handlers.onPointerUp}
      onKeyDown={handlers.onKeyDown}
    >
      <svg viewBox="0 0 390 196" preserveAspectRatio="xMidYMin meet">
        <g ref={wobbleRef}>
          <g ref={rotorRef}>
            {ticks.map((t) => (
              <line
                key={`${t.x1},${t.y1}`}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.major ? '#ff2b1c' : '#4a0b07'}
                strokeWidth={t.major ? 1.6 : 1.2}
              />
            ))}
            <circle cx="195" cy="306" r="232" fill="none" stroke="#ff2b1c" strokeWidth="2" />
            <circle cx="195" cy="306" r="172" fill="none" stroke="#4a0b07" strokeWidth="1" />
            {stations.map(({ station, index, x, y, on }) => (
              <g
                key={station.name}
                data-st={index}
                transform={`translate(${x} ${y})`}
                style={{ color: on ? '#ffe6d8' : '#7a1810', cursor: 'pointer' }}
              >
                <g ref={setUprightRef(index)}>
                  <polygon points={hexagon} fill={on ? '#3a0606' : '#120202'} stroke={on ? '#ff2b1c' : '#4a0b07'} strokeWidth="1.6" />
                  <g dangerouslySetInnerHTML={{ __html: STATION_ICONS[station.icon] }} />
                </g>
              </g>
            ))}
          </g>
          <circle cx="195" cy="306" r="150" fill="#0b0101" stroke="#ff2b1c" strokeWidth="1.5" />
          <circle cx="195" cy="306" r="141" fill="none" stroke="#4a0b07" strokeWidth="6" strokeDasharray="1.5 6" />
        </g>
        <path d="M188 30 H202 L195 42 Z" fill="#ffe6d8" />
        <text x="195" y="181" fill="#ffe6d8" className={styles.freq} fontSize="30" textAnchor="middle">
          {freq}
        </text>
        <text x="195" y="193" fill="#ff2b1c" className={styles.name} fontSize="10" letterSpacing="3" textAnchor="middle">
          {name}
        </text>
      </svg>
      <div className={shared.sr} aria-live="polite">
        {live}
      </div>
    </div>
  );
};

export default Dial;
