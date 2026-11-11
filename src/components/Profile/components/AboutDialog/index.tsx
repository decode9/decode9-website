import { LEGAL_COPY, legalPath } from '@/data/legal';
import { ABOUT_SECTIONS } from '@/data/profile/about';
import { withBase } from '@/utils/asset';
import type { AboutDialogProps } from './interface';
import useAboutDialog from './useAboutDialog';
import styles from './styles.module.scss';

const LEGAL_LINKS = (['privacy', 'terms'] as const).map((kind) => ({
  href: withBase(legalPath('es', kind)),
  label: LEGAL_COPY.es.labels[kind],
}));

/** "About" sheet opened from the moon: rights, privacy, storage, third parties. */
const AboutDialog = ({ open, onClose }: AboutDialogProps) => {
  const { closeRef } = useAboutDialog(open);
  return (
    <>
      <div className={styles.scrim} hidden={!open} onClick={onClose} />
      <section className={styles.about} id="about" role="dialog" aria-modal="true" aria-labelledby="aboutTitle" hidden={!open}>
        <header className={styles.head}>
          <span className={styles.kick}>{'// about · luna'}</span>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Cerrar" onClick={onClose}>
            ×
          </button>
        </header>
        <div className={styles.body}>
          <h2 id="aboutTitle">
            Acerca de este <em>sitio</em>
          </h2>
          <p className={styles.lead}>
            Perfil profesional de Jorge Bastidas. Un viaje por los mundos que ha terraformado: ideas que se convierten en sistemas completos.
          </p>
          <div className={styles.grid}>
            {ABOUT_SECTIONS.map((s) => (
              <article key={s.h}>
                <h3>{s.h}</h3>
                {s.p.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </article>
            ))}
            <article>
              <h3>Contacto</h3>
              <p>
                Usa el walkie de Jorge para escribirle, o escribe a decode9.dev@gmail.com. Sitio de{' '}
                <a href="https://theempire.tech" target="_blank" rel="noopener">
                  the empire ↗
                </a>
                .
              </p>
            </article>
          </div>
          <nav className={styles.legal} aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
};

export default AboutDialog;
