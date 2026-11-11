-- decode9-api · esquema inicial

-- Señales del transmisor (formulario Enlace en escritorio y Contacto en móvil).
CREATE TABLE senales (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo    TEXT    NOT NULL,
  fecha     TEXT    NOT NULL,
  origen    TEXT    NOT NULL CHECK (origen IN ('movil', 'escritorio')),
  idioma    TEXT    NOT NULL,
  alias     TEXT    NOT NULL,
  correo    TEXT    NOT NULL DEFAULT '',
  whatsapp  TEXT    NOT NULL DEFAULT '',
  temas     TEXT    NOT NULL DEFAULT '[]', -- JSON: arreglo de textos
  mensaje   TEXT    NOT NULL DEFAULT '',
  huella    TEXT    NOT NULL
);
CREATE INDEX idx_senales_fecha ON senales (fecha);

-- Mensajes del walkie del perfil.
CREATE TABLE mensajes (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha   TEXT    NOT NULL,
  idioma  TEXT    NOT NULL,
  texto   TEXT    NOT NULL,
  correo  TEXT    NOT NULL DEFAULT '',
  numero  TEXT    NOT NULL DEFAULT '',
  huella  TEXT    NOT NULL
);
CREATE INDEX idx_mensajes_fecha ON mensajes (fecha);

-- Límite de envíos: una fila por intento aceptado. Solo guarda la huella (hash con sal), nunca la IP.
CREATE TABLE limites (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ambito  TEXT    NOT NULL, -- 'senal' | 'walkie'
  huella  TEXT    NOT NULL,
  en      INTEGER NOT NULL  -- epoch en segundos
);
CREATE INDEX idx_limites_busqueda ON limites (ambito, huella, en);
CREATE INDEX idx_limites_en ON limites (en);

-- Caché durable (copia de respaldo de /noticias).
CREATE TABLE cache (
  clave        TEXT    PRIMARY KEY,
  valor        TEXT    NOT NULL,
  guardado_en  INTEGER NOT NULL -- epoch en milisegundos
);
