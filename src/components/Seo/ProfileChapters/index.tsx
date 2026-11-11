import type { ChapterItem } from '@/interfaces/profile';
import type { ProfileChaptersProps } from './interface';

/** Cards still waiting for the CV are titled «Por completar»: their kicker names them instead. */
const PLACEHOLDER_TITLE = 'Por completar';
/** Cards whose body only says the text is still missing are left out of the summary. */
const PLACEHOLDER_BODY = /por (documentar|agregar|completar)/i;
const itemHeading = (item: ChapterItem): string =>
  [item.title && item.title !== PLACEHOLDER_TITLE ? item.title : item.kicker, item.subtitle].filter(Boolean).join(' · ');

/**
 * The profile chapters (Origen, Bitácora, Proyectos, Kit, Colonia, Contacto) as semantic HTML, from
 * the same data the 3D page paints in its chapter panels.
 */
const ProfileChapters = ({ chapters, order, toText }: ProfileChaptersProps) => (
  <article aria-label="Capítulos del perfil de Jorge Bastidas">
    {order.map((id) => {
      const chapter = chapters[id];
      return (
        <section key={id} aria-labelledby={`seo-chapter-${id}`}>
          <h2 id={`seo-chapter-${id}`}>
            {chapter.world}: {toText(chapter.title)}
          </h2>
          {chapter.intro && <p>{chapter.intro}</p>}
          {chapter.items
            .filter((item) => !item.hidden && item.body && !PLACEHOLDER_BODY.test(item.body))
            .map((item) => (
              <section key={`${id}-${item.kicker}-${item.title}`}>
                <h3>{itemHeading(item)}</h3>
                <p>{item.body}</p>
              </section>
            ))}
        </section>
      );
    })}
  </article>
);

export default ProfileChapters;
