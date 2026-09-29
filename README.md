# decode9 — Decode Session

Sitio de Jorge Bastidas (decode9): una **sesión guiada** por capítulos sobre un escenario 3D persistente, con un
agente de IA que narra el recorrido y responde preguntas (Solvo). Export estático a GitHub Pages en
[decode9.codes](https://decode9.codes), en inglés (`/`) y español (`/es/`).

- **Apertura:** la pantalla de carga ensambla el isotipo con partículas al ritmo del progreso real (fuentes, runtime
  3D, modelo, página); al 100 % se materializa el sólido y la marca se desliza a su lugar en el hero.
- **Recorrido horizontal** en desktop (≥1024 px de ancho, ≥600 px de alto, con movimiento permitido): la rueda, el
  trackpad, ← / → y el rail de capítulos avanzan por los paneles. En móvil y con movimiento reducido el sitio es
  vertical y no hay pantalla de carga. La variante de Tailwind `h:` aplica el layout horizontal.

## Stack

- **Next.js 14** (App Router, `output: 'export'`), **React 18**, **TypeScript**, **Tailwind**
- **three.js** (motor propio, cargado de forma diferida) · **GSAP** (ScrollTrigger, SplitText, ScrambleText,
  DrawSVG, MotionPath, Flip) · **Lenis**
- **Blender 5** para el isotipo 3D, el póster de fallback y la imagen OG (modelos como código)
- **Solvo** (canal de chat web) para el guía; sin configurarlo, el guía funciona en modo sin conexión
- **Vitest** para dominio y adaptadores · **Playwright** para el smoke test y las capturas de proyectos

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Desarrollo en `localhost:3000` |
| `npm run build` | Export estático a `out/` |
| `npm start` | Sirve `out/` en `localhost:4173` |
| `npm test` | Tests unitarios (Vitest) |
| `npm run typecheck` / `npm run lint` | TypeScript / ESLint |
| `npm run verify` | Smoke test end-to-end contra `npm start` (`SOLVO_MOCK=1` con un build configurado) |
| `npm run models` | Regenera con Blender el GLB del isotipo y el póster |
| `npm run capture:sites` | Captura los sitios en vivo de los proyectos y los optimiza a WebP |

`?stage=off|low|medium|high` fuerza la calidad del escenario 3D (útil para QA).

## Arquitectura

Regla de dependencias: `components → hooks/context → interfaces (puertos) ← lib (adaptadores)`. Los componentes
nunca importan adaptadores; `components/Experience/components/AppProviders` es el composition root. La lógica que no
es React son funciones fábrica tipadas (`createX(deps): X`).

```
src/
  app/(en)/, app/(es)/es/   dos root layouts estáticos, un diccionario por página
  components/
    Experience/            composición de la página + AppProviders + ChapterConductor
    Layout/                RootDocument, Header (rail de capítulos), Hud, Footer
    Guide/GuideConsole/    consola del guía (launcher, transcript, sugerencias, compositor)
    Stage/                 escenario WebGL (import diferido) y póster de fallback
    Sections/              un capítulo por carpeta: Hero, About, Services, Lab, Work, TechStack, Process, Contact
    UI/                    primitivas compartidas
  context/                 Dictionary, Scene (store), Guide (estado del recorrido + agente)
  data/                    capítulos y estados de escena, proyectos, servicios, stack, labs
  hooks/                   scroll, capítulos, conversación con el agente, narración
  interfaces/              puertos y modelos (ConversationalAgent, SceneStore, CaseStudy…)
  lib/
    agent/                 adaptador de Solvo, agente offline, decorator withFallback
    three/                 stage, partículas, isotipo, formas, director de escena
    scene/, motion/, seo/, config/
  utils/                   funciones puras (markdown seguro, math compartida con los shaders…)
scripts/blender/           isotipo como polígonos → GLB, póster y OG
scripts/capture/           capturas de los proyectos con Playwright
docs/solvo/                corpus y perfil del guía para Solvo
```

Los componentes siguen la convención *module component*: `index.tsx` + `interface.ts` + `useX.ts`, hijos en
`components/`, `export default` al final.

## El guía (Solvo)

El guía narra cada capítulo con textos locales (no gastan tokens) y responde preguntas libres por el canal de chat
web de Solvo. Para ponerlo en vivo, seguir [`docs/solvo/README.md`](docs/solvo/README.md) y completar
`.env.production` a partir de `.env.example`. Si Solvo no está configurado o no responde, el sitio cambia solo al
agente sin conexión.

## Assets

- **Isotipo 3D:** `scripts/blender/isotype_polygons.py` define la marca como polígonos medidos sobre el PNG;
  `npm run models` la extruye en Blender (`public/models/isotype.v1.glb`) y renderiza el póster.
- **OG:** `FONT_DIR=… python3 scripts/blender/compose_og.py` (tipografías OFL de google/fonts).
- **Proyectos:** `npm run capture:sites` (requiere `npx playwright install chromium`). Los logos vienen de los
  repositorios de cada marca.
