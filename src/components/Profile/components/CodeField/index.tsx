import type { CodeFieldProps } from './interface';
import useCodeField from './useCodeField';
import styles from './styles.module.scss';

/** Code snippets drifting upwards behind the galaxy. */
const CodeField = ({ snippets, count }: CodeFieldProps) => {
  const items = useCodeField(snippets, count);
  return (
    <div className={styles.field} aria-hidden="true">
      {items.map((s, i) => (
        <span key={i} style={{ left: s.left, top: s.top, animationDuration: s.duration, animationDelay: s.delay }}>
          {s.text}
        </span>
      ))}
    </div>
  );
};

export default CodeField;
