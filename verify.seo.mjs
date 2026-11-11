/**
 * Static SEO checks over the exported site (./out), no browser needed: per page title, description,
 * canonical, Open Graph, Twitter card, OG image (exists, 1200×630 JPEG, < 300 KB), JSON-LD that parses
 * and is coherent, an h1 and internal links in the static HTML; plus 404/legacy noindex, sitemap,
 * robots, manifest and icons.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://decode9.codes';
const MAIN = ['/', '/decode9/', '/decode9/movil/', '/perfil/'];
const LEGAL = [
  { path: '/privacy/', locale: 'en_US' },
  { path: '/terms/', locale: 'en_US' },
  { path: '/es/privacidad/', locale: 'es_LA' },
  { path: '/es/terminos/', locale: 'es_LA' },
];
const MAX_OG_BYTES = 300 * 1024;

const decode = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const attrs = (tag) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), decode(v)]));

const parseHead = (html) => {
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([t]) => attrs(t));
  const meta = (key) => metas.find((m) => m.name === key || m.property === key)?.content;
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([t]) => attrs(t));
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(([, j]) => j);
  return { meta, metas, links, title, jsonLd };
};

/** Width × height of a baseline/progressive JPEG (first SOFn marker). */
const jpegSize = (buf) => {
  let i = 2;
  while (i < buf.length) {
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
};
const pngSize = (buf) => ({ width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) });

const htmlFile = (out, path) => join(out, path, 'index.html');

const checkImage = (out, url, check, label) => {
  const file = join(out, url.replace(SITE, ''));
  if (!existsSync(file)) return check(`${label}: og:image exists in out/`, false, url);
  const buf = readFileSync(file);
  const size = jpegSize(buf);
  check(`${label}: og:image is 1200×630 JPEG`, size?.width === 1200 && size?.height === 630, JSON.stringify(size));
  check(`${label}: og:image < 300 KB`, buf.length < MAX_OG_BYTES, `${Math.round(buf.length / 1024)} KB`);
};

const checkJsonLd = (head, path, check, label) => {
  let graph = [];
  try {
    graph = head.jsonLd.flatMap((j) => {
      const data = JSON.parse(j);
      return data['@graph'] ?? [data];
    });
    check(`${label}: JSON-LD parses`, head.jsonLd.length > 0, `${head.jsonLd.length} block(s)`);
  } catch (error) {
    return check(`${label}: JSON-LD parses`, false, String(error));
  }
  const page = graph.find((n) => n['@type'] === 'WebPage' || n['@type'] === 'ProfilePage');
  check(`${label}: JSON-LD WebPage with this url`, page?.url === `${SITE}${path}`, page?.['@type']);
  if (!MAIN.includes(path)) return;
  const site = graph.find((n) => n['@type'] === 'WebSite');
  check(`${label}: JSON-LD WebSite with publisher`, !!site?.publisher?.['@id']);
  const person = graph.find((n) => n['@type'] === 'Person');
  check(`${label}: JSON-LD Person resolves the publisher id`, person?.['@id'] === site?.publisher?.['@id']);
  if (path === '/' || path === '/perfil/') {
    check(`${label}: full Person (worksFor, sameAs, knowsAbout)`, !!person?.worksFor && person?.sameAs?.length > 0 && person?.knowsAbout?.length > 0);
  }
  if (path === '/perfil/') {
    check(`${label}: ProfilePage with mainEntity Person`, page?.['@type'] === 'ProfilePage' && page?.mainEntity?.['@id'] === person?.['@id']);
  }
};

const checkPage = (out, path, check, { locale, main }) => {
  const label = `seo ${path}`;
  const file = htmlFile(out, path);
  if (!existsSync(file)) return check(`${label}: exists in out/`, false);
  const html = readFileSync(file, 'utf8');
  const head = parseHead(html);
  const url = `${SITE}${path}`;
  const description = head.meta('description') ?? '';

  check(`${label}: title`, main ? head.title.length >= 50 && head.title.length <= 60 : head.title.length > 0, `${head.title.length} · ${head.title}`);
  check(`${label}: description`, main ? description.length >= 140 && description.length <= 160 : description.length >= 50, `${description.length}`);
  check(`${label}: canonical`, head.links.find((l) => l.rel === 'canonical')?.href === url);
  check(`${label}: og:title/description/url`, head.meta('og:title') === head.title && head.meta('og:description') === description && head.meta('og:url') === url);
  check(`${label}: og:locale`, head.meta('og:locale') === locale, head.meta('og:locale'));
  const image = head.meta('og:image') ?? '';
  check(`${label}: og:image absolute + size + alt`, image.startsWith(`${SITE}/og/`) && head.meta('og:image:width') === '1200' && head.meta('og:image:height') === '630' && (head.meta('og:image:alt') ?? '').length > 20, image);
  check(`${label}: twitter card = og`, head.meta('twitter:card') === 'summary_large_image' && head.meta('twitter:image') === image && head.meta('twitter:title') === head.title);
  check(`${label}: no unverified twitter:site/creator`, !head.meta('twitter:site') && !head.meta('twitter:creator'));
  check(`${label}: indexable (no noindex)`, !/noindex/.test(head.meta('robots') ?? ''));
  checkImage(out, image, check, label);
  checkJsonLd(head, path, check, label);
  if (main) {
    const body = html.split('<body')[1] ?? '';
    check(`${label}: static h1`, /<h1[^>]*>[^<]{10,}/.test(body));
    const internal = [...body.matchAll(/<a [^>]*href="(\/[^"]*)"/g)].map(([, h]) => h).filter((h) => h !== path);
    check(`${label}: internal links in static HTML`, internal.length >= 2, internal.join(' '));
  }
  if (!main) {
    const alternates = head.links.filter((l) => l.rel === 'alternate' && l.hreflang).map((l) => l.hreflang);
    check(`${label}: hreflang en/es/x-default`, ['en', 'es', 'x-default'].every((h) => alternates.includes(h)), alternates.join(','));
  }
};

export const checkSeo = (out, check) => {
  for (const path of MAIN) checkPage(out, path, check, { locale: 'es_LA', main: true });
  for (const { path, locale } of LEGAL) checkPage(out, path, check, { locale, main: false });

  const notFound = readFileSync(join(out, '404.html'), 'utf8');
  check('seo 404: noindex + own title', /<meta name="robots" content="noindex/.test(notFound) && /<title>Señal perdida/.test(notFound));
  check('seo /es/: noindex', /<meta name="robots" content="noindex/.test(readFileSync(htmlFile(out, '/es/'), 'utf8')));

  const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
  const entries = sitemap.match(/<url>/g)?.length ?? 0;
  check('sitemap: 8 urls, all with lastmod', entries === 8 && (sitemap.match(/<lastmod>/g)?.length ?? 0) === entries, `${entries} urls`);
  check('sitemap: hreflang on legal pages', (sitemap.match(/hreflang=/g)?.length ?? 0) >= 12);
  check('robots.txt: points to the sitemap', readFileSync(join(out, 'robots.txt'), 'utf8').includes(`Sitemap: ${SITE}/sitemap.xml`));

  const manifest = JSON.parse(readFileSync(join(out, 'manifest.webmanifest'), 'utf8'));
  check('manifest: name + 192/512 icons', !!manifest.name && ['192x192', '512x512'].every((s) => manifest.icons.some((i) => i.sizes === s)));
  check('favicon.ico: not empty', statSync(join(out, 'favicon.ico')).size > 1000);
  const apple = pngSize(readFileSync(join(out, 'apple-touch-icon.png')));
  check('apple-touch-icon: 180×180', apple.width === 180 && apple.height === 180);
  const home = parseHead(readFileSync(htmlFile(out, '/'), 'utf8'));
  check('head links manifest and apple icon', home.links.some((l) => l.rel === 'manifest') && home.links.some((l) => l.rel === 'apple-touch-icon'));
};
