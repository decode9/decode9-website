# decode9 — conocimiento y perfil del guía (Solvo)

El guía del sitio responde las preguntas libres con el **canal de chat web de
Solvo** (`/api/publico/chat/*`). Esta carpeta es lo que esa instalación de Solvo
necesita para hablar de decode9: el corpus que consulta con `buscar_conocimiento`
y el texto de «Cómo atiende».

```
fuente/*.md          la fuente que se edita (un tema por documento)
agent-profile.md     el texto de «Cómo atiende» del panel del agente
```

Mismo formato que `TheEmpire/chatbot/the-empire-knowledge`: lo que se ingesta es
el **PDF** de cada `.md` (se pagina y se trocea por página). Se pueden generar
con el `regenerar.sh` de ese corpus o cargando los `.md` convertidos desde la
pantalla **Conocimiento** del panel.

## Poner el guía en vivo

1. En la instalación de Solvo que atiende a decode9, encender el canal **web**.
2. Dominios permitidos, exactos: `https://decode9.codes` y, para desarrollo,
   `http://localhost:3000` y `http://localhost:4173`.
3. Cargar `fuente/` en **Conocimiento** y pegar `agent-profile.md` en **Cómo atiende**.
4. Poner el **nombre visible** del agente: es el que muestra el sitio.
5. Copiar la clave `wpk_…` y la URL de la API a `.env.production` (ver
   `.env.example`) y desplegar.

Sin esas variables el sitio funciona igual, con el guía en modo sin conexión.

## Cómo se escribe

- Siempre «decode9» y «Jorge Bastidas» con nombre propio: la búsqueda semántica
  necesita encontrarlos en cada fragmento.
- Sólo hechos verificables en el sitio o en los repositorios. Nada de precios ni
  plazos que Jorge no haya publicado.
- Cifras de proyectos: las documentadas (no las de prensa).
