import { SHELL_TEXT } from '@/data/terminal/texts';
import Bi from '../../../../components/Bilingual';
import type { BlogProps } from './interface';
import styles from './styles.module.scss';
import useBlog from './useBlog';

/** Inicio · Bitácora (original key 'blog'). */
const Blog = ({ announce, reduceMotion }: BlogProps) => {
  const lines = useBlog(announce, reduceMotion);
  return (
    <div className={styles.txlog}>
      {lines.map((l) => (
        <div key={l.id} className={l.ok ? styles.ok : undefined}>
          {'> '}
          {l.user ? (
            <>
              <Bi t={SHELL_TEXT.sessionOpened} />
              {l.user}
            </>
          ) : (
            <Bi t={l.t} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Blog;
