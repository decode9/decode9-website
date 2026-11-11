import StationDial from './components/StationDial';
import type { TopBarProps } from './interface';
import useTopBar from './useTopBar';
import styles from './styles.module.scss';

/** Fixed header: Jorge's name and the radio dial of the 7 stations. */
const TopBar = (props: TopBarProps) => {
  const { name, role } = useTopBar();
  return (
    <div className={styles.top}>
      <div className={styles.who}>
        <h1 aria-label={`${name.first} ${name.last}`}>
          <span className={styles.fn}>{name.first}</span>
          <span className={styles.ln}>{name.last}</span>
        </h1>
        <p>
          <b>{role}</b> · the empire
        </p>
      </div>
      <StationDial {...props} />
    </div>
  );
};

export default TopBar;
