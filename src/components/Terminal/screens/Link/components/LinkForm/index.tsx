import { LINK_LIMITS, LINK_TEXT, LINK_TOPICS } from '@/data/terminal/channel';
import { cn } from '@/utils/cn';
import content from '../../../../styles/content.module.scss';
import Bi from '../../../../components/Bilingual';
import type { LinkFormProps } from './interface';
import styles from './styles.module.scss';
import useLinkForm from './useLinkForm';

/** Enlace: "Want to talk with decode9?" form (original form#olform). */
const LinkForm = (props: LinkFormProps) => {
  const f = useLinkForm(props);
  return (
    <div className={content.pane}>
      <form className={styles.form} noValidate onSubmit={f.submit}>
        <span className={content.lbl}>
          <Bi t={LINK_TEXT.kicker} />
        </span>
        <p className={cn(content.body, styles.intro)} data-dec>
          <Bi t={LINK_TEXT.intro} />
        </p>
        <div className={styles.fld}>
          <label htmlFor="ol-alias">{LINK_TEXT.alias}</label>
          <input
            id="ol-alias"
            ref={f.aliasRef}
            type="text"
            maxLength={LINK_LIMITS.alias}
            autoComplete="nickname"
            placeholder={LINK_TEXT.aliasPlaceholder}
            value={f.alias}
            aria-invalid={f.invalid.alias}
            onChange={(e) => f.setAlias(e.target.value)}
          />
        </div>
        <div className={styles.fld}>
          <label htmlFor="ol-mail">
            <Bi t={LINK_TEXT.email} />
          </label>
          <input
            id="ol-mail"
            ref={f.emailRef}
            type="email"
            maxLength={LINK_LIMITS.email}
            autoComplete="email"
            placeholder={LINK_TEXT.emailPlaceholder}
            value={f.email}
            aria-invalid={f.invalid.email}
            onChange={(e) => f.setEmail(e.target.value)}
          />
        </div>
        <fieldset className={cn(styles.fld, styles.topics)}>
          <legend>
            <Bi t={LINK_TEXT.topics} />
          </legend>
          {LINK_TOPICS.map((t, i) => (
            <label key={t.value}>
              <input type="checkbox" id={`ol-t${i}`} value={t.value} checked={f.topics.includes(t.value)} onChange={() => f.toggleTopic(t.value)} />
              <span className={styles.ch}>
                <Bi t={t.t} />
              </span>
            </label>
          ))}
        </fieldset>
        <div className={styles.fld}>
          <label htmlFor="ol-msg">
            <Bi t={LINK_TEXT.message} />
          </label>
          <textarea id="ol-msg" rows={2} maxLength={LINK_LIMITS.msg} value={f.msg} onChange={(e) => f.setMsg(e.target.value)} />
        </div>
        <button type="submit" className={content.btn} disabled={f.sending}>
          ▶ <Bi t={LINK_TEXT.send} />
        </button>
        <p className={cn(content.note, f.note.err && content.noteErr)} role="status">
          <Bi t={f.note.t} />
        </p>
      </form>
    </div>
  );
};

export default LinkForm;
