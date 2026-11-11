import type { NewsTickerProps } from './interface';
import useNewsTicker from './useNewsTicker';
import styles from './styles.module.scss';

/** Endless ticker: tech headlines when loaded, otherwise the current world's line. Content is doubled to loop. */
const NewsTicker = ({ news, tick }: NewsTickerProps) => {
  const { runRef, duration } = useNewsTicker(news.length ? `n${news.length}` : tick[0]);
  const seq = (copy: number) =>
    news.length
      ? news.map((n, i) => (
          <a key={`${copy}-${i}`} href={n.url} target="_blank" rel="noopener">
            <em className={styles.cat} data-c={n.cat}>
              {n.cat}
            </em>
            {n.titulo}
            <small>· {n.fuente}</small>
          </a>
        ))
      : [0, 1].map((k) => (
          <span key={`${copy}-${k}`}>
            <em>{tick[0]}</em> · recurso: {tick[1]} → {tick[2]} · {tick[3]} · haz scroll para viajar entre mundos · ✦
          </span>
        ));
  return (
    <div className={styles.ticker} aria-label="Noticias de tecnología">
      <div className={styles.run} ref={runRef} style={{ animationDuration: duration }}>
        {seq(0)}
        {seq(1)}
      </div>
    </div>
  );
};

export default NewsTicker;
