# decode9-api (Cloudflare Worker)

API de los formularios y noticias de decode9.codes. Reemplaza a los PHP del sitio viejo
(`senal.php`, `mensaje.php`, `noticias.php`) con el mismo contrato. Hono + zod + D1.

| Ruta | Qué hace |
|---|---|
| `POST /senal` | Señal del transmisor (Enlace en escritorio y Contacto en móvil). Guarda en la tabla `senales` y responde un código `SOS-####`. |
| `POST /walkie` | Mensaje del walkie del perfil. Detecta correo o teléfono en el texto. Guarda en `mensajes`. |
| `GET /noticias` | Junta 5 fuentes (php.net, CoinDesk, Hacker News, Ars Technica, TechCrunch). Caché de 30 min; si todas las fuentes fallan, devuelve la última copia. |

- **Límite:** 5 envíos cada 10 min por persona y por ruta. Se cuenta con un hash SHA-256 de la IP con sal, nunca con la IP.
- **Robots:** si llega el campo invisible `web` con algo, se responde éxito y no se guarda nada.
- **Correo:** si hay `RESEND_API_KEY` y `NOTIFY_TO`, avisa por Resend sin demorar la respuesta. Sin esos secrets solo guarda.
- **CORS:** solo para los orígenes de `ALLOWED_ORIGINS` (en `wrangler.toml`).

## Desarrollo

```bash
npm install
cp .dev.vars.example .dev.vars   # pon una SALT cualquiera
npm run db:migrate:local
npm run dev                      # http://localhost:8787
npm run verify                   # lint + typecheck + pruebas
```

## Desplegar (una sola vez; después basta `npm run deploy`)

```bash
npx wrangler login
npx wrangler d1 create decode9-api
# Pega el database_id que imprime en wrangler.toml → [[env.production.d1_databases]]
npm run db:migrate:remote
npx wrangler secret put SALT --env production            # p. ej. openssl rand -hex 32
npx wrangler secret put RESEND_API_KEY --env production  # opcional
npx wrangler secret put NOTIFY_TO --env production       # opcional, correos separados por coma
npm run deploy
```

`deploy` imprime la URL (`https://decode9-api.<cuenta>.workers.dev`). Ponla en
`NEXT_PUBLIC_API_URL` de `../.env.production` y vuelve a construir el sitio.

Para el correo, el dominio del remitente (`NOTIFY_FROM`, por defecto `transmisor@decode9.codes`)
tiene que estar verificado en Resend. Sus registros DNS se agregan en Namecheap.

Ver lo recibido:
`npx wrangler d1 execute DB --remote --env production --command "select * from senales order by id desc limit 20"`
