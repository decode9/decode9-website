'use client';

import dynamic from 'next/dynamic';
import type { TerminalProps } from './interface';
import styles from './styles.module.scss';

/* The shell touches window, canvas and Web Audio: it is mounted only on the client. */
const Shell = dynamic(() => import('./components/Shell'), { ssr: false });

/** decode9 · Terminal (/decode9/). The static HTML keeps an indexable summary; the CRT shell mounts on the client. */
const Terminal = (_props: TerminalProps) => (
  <>
    <div className={styles.seo}>
      <h1>decode9 · Terminal de los archivos de los demonoides</h1>
      <p>
        Sistema operativo de decode9: manifiesto, expediente de origen, laboratorio, códice de razas y lugares, archivo de
        señales, canal de publicaciones y enlace con el transmisor.
      </p>
    </div>
    <Shell />
  </>
);

export default Terminal;
