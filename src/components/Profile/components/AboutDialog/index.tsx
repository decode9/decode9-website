import { LEGAL_COPY, legalPath } from '@/data/legal';
import { withBase } from '@/utils/asset';
import type { AboutDialogProps } from './interface';
import useAboutDialog from './useAboutDialog';
import styles from './styles.module.scss';

const SECTIONS: { h: string; p: string[] }[] = [
  { h: 'Derechos', p: ['© 2026 the empire. Todos los derechos reservados. Los textos, la marca, las ilustraciones y el código de este sitio no se pueden reproducir sin autorización.'] },
  {
    h: 'Política de privacidad',
    p: [
      'Si escribes por el walkie, guardamos tu mensaje y el correo o número que dejes, solo para responderte. No vendemos ni compartimos estos datos. Para evitar abusos se guarda una huella anónima de la conexión, no tu dirección IP.',
      'Puedes pedir que borremos tu mensaje escribiendo por el mismo walkie.',
    ],
  },
  { h: 'Almacenamiento local', p: ['El sitio no usa cookies de seguimiento. Solo recuerda en tu navegador si dejaste el sonido encendido o apagado.'] },
  { h: 'Contenido de terceros', p: ['La sección Actualidad muestra titulares públicos de php.net, CoinDesk, Hacker News, Ars Technica y TechCrunch, con enlace a cada nota. Las tipografías se cargan desde Google Fonts.'] },
  { h: 'Sonido', p: ['El ambiente espacial se genera en tu navegador y puedes apagarlo con el botón de la barra inferior.'] },
];

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
          <span className={styles.prov}>textos legales en borrador · validar antes de publicar</span>
          <div className={styles.grid}>
            {SECTIONS.map((s) => (
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
                Usa el walkie de Jorge para escribirle. Sitio de{' '}
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
