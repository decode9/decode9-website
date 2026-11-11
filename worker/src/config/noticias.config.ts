import type { FuenteNoticias } from "../interfaces/domain/noticia.js";

/** Minutos que se reutiliza la última respuesta antes de volver a leer las fuentes. */
export const NOTICIAS_CACHE_MIN = 30;

export const FUENTES_NOTICIAS: readonly FuenteNoticias[] = [
  { cat: "PHP", tipo: "atom", nombre: "php.net", url: "https://www.php.net/feed.atom", max: 3 },
  { cat: "Cripto", tipo: "rss", nombre: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", max: 5 },
  { cat: "Dev", tipo: "hn", nombre: "Hacker News", url: "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=30", max: 6 },
  { cat: "Tecnología", tipo: "rss", nombre: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/technology-lab", max: 4 },
  { cat: "Tecnología", tipo: "rss", nombre: "TechCrunch", url: "https://techcrunch.com/feed/", max: 4 },
];

/** Temas cercanos al trabajo de Jorge: se muestran primero. */
export const CLAVES_NOTICIAS: readonly string[] = [
  "php", "laravel", "javascript", "typescript", "node", "react", "python", "api", "cloud", "aws", "docker", "kubernetes",
  "linux", "database", "sql", "postgres", "security", "seguridad", "open source", "github", "ai", "llm", "binance",
  "bitcoin", "ethereum", "crypto", "blockchain", "fintech", "payments", "web", "browser", "devops", "rust", "golang",
];
