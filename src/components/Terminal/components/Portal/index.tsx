import { PORTAL_TEXT } from '@/data/terminal';
import Bi from '../Bilingual';
import type { PortalProps } from './interface';
import usePortal from './usePortal';
import styles from './styles.module.scss';

const Capsule = () => (
  <>
    <span className="capsule" aria-hidden="true">
      <span className="half top" />
      <span className="half bot" />
      <span className="seam" />
      <span className="inner" />
      <span className="shine" />
      <span className="shine2" />
      <span className="cap" />
    </span>
    <span className="shadow" aria-hidden="true" />
  </>
);

/** Red/blue pill chooser (original #portal, inactive: the pills now live on the entry page). */
const Portal = (props: PortalProps) => {
  const { reveal, setReveal, revRef, enterRed, blueHref } = usePortal(props);
  const red = () => setReveal({ kind: 'r', text: 'DECODE9' });
  const blue = () => setReveal({ kind: 'b', text: 'Jorge Bastidas' });
  const off = () => setReveal(null);
  if (!props.open) return null;
  return (
    <section className={styles.portal} aria-label="Elige tu camino / Choose your path">
      <p className="pt-ask">
        <Bi t={PORTAL_TEXT.ask} />
      </p>
      <div ref={revRef} className={`pt-rev ${reveal?.kind ?? ''}`} aria-live="polite">
        {reveal?.text}
      </div>
      <div className="pills">
        <button type="button" className="pill-btn pill-red" aria-label={PORTAL_TEXT.redLabel} onClick={enterRed} onMouseEnter={red} onFocus={red} onMouseLeave={off} onBlur={off}>
          <Capsule />
          <span className="tag-under">decode9</span>
        </button>
        <a className="pill-btn pill-blue" href={blueHref} aria-label={PORTAL_TEXT.blueLabel} onMouseEnter={blue} onFocus={blue} onMouseLeave={off} onBlur={off}>
          <Capsule />
          <span className="tag-under">Jorge Bastidas</span>
        </a>
      </div>
      <p className="pt-foot">
        <Bi t={PORTAL_TEXT.foot} />
      </p>
    </section>
  );
};

export default Portal;
