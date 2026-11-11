# decode9 · decode9.codes

Sitio personal de Jorge Bastidas (decode9). Es un export estático de Next.js que se publica en GitHub Pages en
[decode9.codes](https://decode9.codes), todo en español (`lang="es"`). Tiene cuatro páginas:

| Ruta | Página | Qué es |
| --- | --- | --- |
| `/` | Entrada «Elige tu lado» | El lado rojo lleva a decode9 y el azul al perfil profesional. La cara de Jorge sigue el puntero o el giroscopio. En celular, el lado rojo abre `/decode9/movil/`. |
| `/decode9/` | Terminal | Escritorio CRT con ventanas: archivos del investigador, Canal de publicaciones, Enlace (formulario de contacto), menú contextual y ES/EN dentro de la página. |
| `/decode9/movil/` | Transmisor | Versión de celular de decode9: dial, llamada, contacto, transmisiones, bitácoras y audios. |
| `/perfil/` | Perfil de Jorge | Recorrido 3D por scroll entre los mundos que terraforma, con capítulos, noticias, walkie de contacto y salto a decode9. |

`/es/` es la URL del sitio anterior: redirige a `/` y lleva `noindex`.

**Parámetros de URL:** `?escritorio=1` fuerza la versión de escritorio en celular (entrada y terminal), `?alias=`
llega desde el QR de la terminal al transmisor, `?giro=1` activa el giroscopio, y `?hora=` y `?sim=1` simulan la hora
del perfil.

## Stack

- **Next.js 14** (App Router, `output: 'export'`, `trailingSlash`), **React 18**, **TypeScript**
- **Sass** (CSS Modules por componente) y **Tailwind** para lo global
- **three.js** para la escena del perfil, **Web Audio** y `speechSynthesis` para sonido y voz, y
  **qrcode-generator** para el QR de la terminal
- **Vitest** para dominio y adaptadores, y **Playwright** para el smoke test
- **Cloudflare Worker** (`worker/`, Hono + zod + D1) como API de formularios y noticias
- **Google Analytics 4** (`G-VMLFSX6GXW`) y AdSense (`ca-pub-1675722214703683`, `public/ads.txt`)

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Desarrollo en `localhost:3000` |
| `npm run build` | Export estático a `out/` |
| `npm start` | Sirve `out/` en `localhost:4173` |
| `npm test` | Tests unitarios (Vitest) |
| `npm run typecheck` / `npm run lint` | TypeScript / ESLint |
| `npm run verify` | Smoke test con Playwright contra `npm start` |

`npm run verify` usa el Chromium de Playwright. Si no lo encuentra, toma `CHROME=/ruta/al/navegador` o el
`chromium_headless_shell` de `~/.cache/ms-playwright`. `VERIFY_URL` cambia la URL base.

## Arquitectura

Regla de dependencias: `components → hooks → interfaces (puertos) ← lib (adaptadores)`. Los componentes no importan
la infraestructura de `lib/`. La reciben por props o hooks desde el **composition root**, que es el `index.tsx` del
componente raíz de cada página (`Entry`, `Terminal/components/Shell`, `Transmitter` y `Profile`). Las piezas que no son
React son fábricas `createX(deps)` que devuelven un objeto con `dispose()`. three.js, Web Audio, voz, QR, canvas pesado
y `fetch` viven solo en `lib/`.

Las páginas interactivas se montan solo en el cliente (`dynamic(..., { ssr: false })` dentro de un wrapper
`'use client'`). El HTML estático conserva el texto que sirve para SEO.

```
src/
  app/                     rutas: page.tsx, decode9/, decode9/movil/, perfil/, es/ (redirige), robots.ts, sitemap.ts
  components/
    Layout/RootDocument/   <html lang="es">, fuentes, GA y JSON-LD
    Entry/                 «Elige tu lado» (cara, mira, giroscopio y warp de salida)
    Terminal/              shell CRT, gestor de ventanas y pantallas (screens/: Home, Channel, Link…)
    Transmitter/           transmisor móvil (dial, llamada, canal, contacto, hojas de medios)
    Profile/               perfil 3D (estaciones, capítulos, walkie, noche, salto a decode9)
  data/                    textos y contenidos tipados: entry/, terminal/, transmitter/, profile/, posts.ts, profanity.ts
  hooks/                   dispositivo, giroscopio, modo de entrada, rutas por hash
  interfaces/              puertos y modelos: analytics, signal, walkie, news, post, audio, storage, terminal…
  lib/
    api/                   cliente HTTP y gateways (señal, walkie, noticias con respaldo de Hacker News)
    audio/, canvas/, three/profile/, net/, share/
    seo/                   site.ts (título, descripción y theme-color por ruta), metadata.ts, jsonLd.ts
    analytics.ts           trackEvent (GA4)
    tracking.ts            adaptador del puerto Analytics y decoradores de los gateways
    config/env.ts          NEXT_PUBLIC_API_URL
  utils/                   funciones puras (validadores, groserías, storage, math…)
worker/                    API en Cloudflare (proyecto aparte, con su propio package.json)
docs/arquitectura.md       mapa del sitio y convenciones en detalle
verify.mjs                 smoke test de Playwright
```

Más detalle (mapa de páginas, claves de `localStorage`, assets y fuentes) en
[`docs/arquitectura.md`](docs/arquitectura.md).

## Convenciones

- **Module component:** una carpeta por componente con `index.tsx`, `interface.ts`, `useX.ts` y `styles.module.scss`.
  Los hijos van en `components/`. Siempre arrow functions y `export default` al final.
- **Datos** en `src/data/`, tipados contra `src/interfaces/`. Los textos bilingües de la terminal son tuplas `[es, en]`.
- **Analítica:** los eventos pasan por el puerto `Analytics` (`interfaces/analytics.ts`). Llevan solo valores
  cerrados, **nunca texto del visitante**. Eventos: `choose_side` {side}, `signal_sent` {origen, ok},
  `walkie_sent` {ok}, `post_open` {type, id} y `d9_jump`.
- **SEO:** cada ruta tiene título, descripción, canonical, Open Graph (`es_LA`; `en_US` en las legales en inglés) y
  Twitter con su imagen propia en `public/og/*.jpg` (1200×630), definidos en `lib/seo/site.ts`. JSON-LD por página
  (WebSite + WebPage/ProfilePage + Person), resumen indexable en el HTML estático, sitemap con `lastmod`, robots,
  manifest e íconos. `npm run verify` lo comprueba sobre `out/` (`verify.seo.mjs`). Detalle en
  [docs/arquitectura.md](docs/arquitectura.md#seo).

## Worker / API

`worker/` reemplaza los PHP del sitio viejo con el mismo contrato:

| Ruta | Uso |
| --- | --- |
| `POST /senal` | Enlace de la terminal y Contacto del transmisor. Responde un código `SOS-####`. |
| `POST /walkie` | Walkie del perfil. |
| `GET /noticias` | Ticker del perfil. Junta 5 fuentes con caché de 30 min. |

Sin `NEXT_PUBLIC_API_URL`, los formularios avisan que el canal no está disponible y las noticias salen del respaldo
de Hacker News. Instalación, D1, secrets y despliegue están en [`worker/README.md`](worker/README.md).

## Despliegue

1. **Worker:** `cd worker && npm run deploy`. La primera vez hay que seguir los pasos de `worker/README.md`
   (`wrangler login`, D1, migraciones y secrets).
2. **Sitio:** pon la URL que imprime el deploy en `.env.production` y haz push a `main`. El workflow
   `.github/workflows/nextjs.yml` corre `npm test`, `typecheck` y `next build`, y publica `out/` en GitHub Pages
   con el `CNAME` `decode9.codes`.

## Variables

| Variable | Archivo | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `.env.production` (versionado) | URL del worker. Es pública y queda dentro del build estático. Vacía = sin API. |

Para desarrollo local usa `.env.local` (ignorado por git) a partir de `.env.example`.
