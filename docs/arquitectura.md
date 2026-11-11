# Arquitectura del sitio decode9

Referencia para quien vuelva a tocar el sitio. La visión general, los scripts y el despliegue están en el
[README](../README.md).

## Origen

El sitio es el port a Next.js de un original en HTML vanilla (`~/Proyectos/decode9/jorge`, de solo lectura): 4 HTML con
el CSS y el JS dentro, más PHP en `decode9/api` y `perfil/api`. Los PHP los reemplaza el worker de `worker/`. La regla
del port fue **paridad visual y de comportamiento**: textos, animaciones, sonidos, tiempos, URLs, `localStorage` y
redirecciones de móvil. Se reordenó el código, no el diseño.

Para comparar: `npx serve ~/Proyectos/decode9/jorge -l 5055` frente a `npm run build && npm start` (:4173).

## Mapa de páginas (original → port)

| Ruta | Original | Componente raíz (composition root) |
|---|---|---|
| `/` Entrada | `jorge/index.html` | `components/Entry` |
| `/decode9/` Terminal | `jorge/decode9/index.html` | `components/Terminal` (raíz de dependencias en `components/Shell`) |
| `/decode9/movil/` Transmisor | `jorge/decode9/movil/index.html` | `components/Transmitter` |
| `/perfil/` Perfil | `jorge/perfil/index.html` | `components/Profile` |
| `/es/` | URL del sitio anterior | `app/es/page.tsx` (redirige a `/`, `noindex`) |

## Contratos que hay que conservar

- **Parámetros de URL:** `?escritorio=1` (entrada y terminal en celular), `?alias=` (QR de la terminal hacia el
  móvil), `?giro=1`, `?hora=` y `?sim=1` (perfil).
- **Claves de localStorage:** `d9crt-lang`, `d9crt-fx`, `d9crt-mute`, `d9m-mute`, `tf-sound`.
- **Assets:** los `img/x` del original están en `/decode9/img/x`. Los frames de la entrada, en
  `/entrada/frames/fNN.webp`. Favicon y OG en `public/brand/`. three y QR vienen de npm. Las fuentes las sirve
  `next/font` (`lib/fonts.ts`).
- **Variables CSS de fuentes:** `--font-archivo` (D9 Body y perfil, eje `wdth`), `--font-barlow` (D9 Sport y `--f-b`),
  `--font-tag` (D9 Tag), `--font-teko` (`--f-h`), `--font-share` (`--f-m`), `--font-jetbrains` (`--f-code`).
- **No tocar sin motivo:** `GA_ID` en `lib/analytics.ts`, `public/ads.txt`, `CNAME` y `public/brand/`.

## Reglas de código

1. **Module component:** carpeta con `index.tsx`, `interface.ts`, `useX.ts` y `styles.module.scss`. Los hijos van en
   `components/`. Arrow functions y `export default` al final.
2. **Dependencias:** `components → hooks → interfaces ← lib`. Los componentes no importan infraestructura de `lib/`:
   la reciben por hooks o props desde el composition root. Lo que no es React son fábricas `createX(deps)` con
   `dispose()`.
3. **three.js, Web Audio, speechSynthesis, QR, canvas pesado y `fetch` viven solo en `lib/`** (`lib/three/profile`,
   `lib/audio`, `lib/canvas`, `lib/api`).
4. Las páginas interactivas se montan solo en el cliente con `dynamic(() => import(...), { ssr: false })` dentro de un
   wrapper `'use client'`. El HTML estático conserva el texto para SEO.
5. **Datos** en `src/data/`, tipados contra `src/interfaces/`. Textos bilingües de la terminal como tuplas `[es, en]`.
   El ES/EN existe solo dentro de la terminal; el resto del sitio es español.
6. **Analítica:** puerto `Analytics` (`interfaces/analytics.ts`) con su adaptador GA4 en `lib/tracking.ts`. Los envíos
   de señal y walkie se miden con los decoradores `withSignalTracking` y `withWalkieTracking` sobre los gateways, sin
   tocar los formularios. Nunca se envía texto del visitante.

## Rutas clave

- `src/app/{layout.tsx, page.tsx, decode9/page.tsx, decode9/movil/page.tsx, perfil/page.tsx, es/page.tsx, robots.ts, sitemap.ts}`
- `src/lib/seo/site.ts`: título, descripción, theme-color y prioridad de sitemap por ruta.
- `src/lib/config/env.ts`: `env.apiUrl` desde `NEXT_PUBLIC_API_URL`. Si viene vacío, el canal no está disponible y
  las noticias salen del respaldo de Hacker News.
- `src/interfaces/`: `analytics`, `post`, `signal`, `walkie` (estados ok, rate-limited (429), empty, unavailable y
  failed), `news`, `audio`, `storage`, `terminal`, `transmitter` y `profile`.
- `src/utils/`: `profanity`, `validators` (alias, correo, WhatsApp, canal de regreso, texto del walkie y `LIMITS`),
  `storage`, `cn`, `math` y `async`.

## Verificación

```
npm run typecheck && npm run lint && npm test && npm run build
npm start          # sirve out/ en :4173
npm run verify     # Playwright: 4 rutas sin errores, lang="es", /es/ → /, redirección móvil y contacto del transmisor
```
