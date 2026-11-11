export const ATOM_PHP = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>PHP.net news</title>
  <link rel="self" href="https://www.php.net/feed.atom"/>
  <entry>
    <title>PHP 8.5.1 Released!</title>
    <link rel="self" href="https://www.php.net/self/1"/>
    <link href="https://www.php.net/releases/8_5_1.php" rel="alternate" type="text/html"/>
    <updated>2026-11-01T10:00:00+00:00</updated>
  </entry>
  <entry>
    <title>Conference &amp;amp; meetup</title>
    <link href="https://www.php.net/conf"/>
    <published>2026-11-05T10:00:00+00:00</published>
  </entry>
  <entry>
    <title>Old news</title>
    <link href="https://www.php.net/old"/>
    <updated>2025-01-01T10:00:00+00:00</updated>
  </entry>
  <entry>
    <title>Sin enlace http</title>
    <link href="ftp://php.net/x"/>
    <updated>2026-11-09T10:00:00+00:00</updated>
  </entry>
</feed>`;

export const RSS_COINDESK = `<?xml version="1.0"?>
<rss version="2.0"><channel><title>CoinDesk</title>
  <item><title><![CDATA[Markets <b>rally</b> &amp; stall]]></title><link>https://coindesk.com/a</link><pubDate>Mon, 10 Nov 2026 08:00:00 GMT</pubDate></item>
  <item><title>Bitcoin hits new high</title><link>https://coindesk.com/b</link><pubDate>Sun, 02 Nov 2026 08:00:00 GMT</pubDate></item>
  <item><title>Shared story about AI</title><link>https://shared.example/story</link><pubDate>Sat, 01 Nov 2026 08:00:00 GMT</pubDate></item>
</channel></rss>`;

export const HN_JSON = JSON.stringify({
  hits: [
    { title: "Show HN: a tiny Rust database", url: "https://example.com/rust-db", objectID: "1", created_at: "2026-11-10T09:00:00Z" },
    { title: "Ask HN: anything", url: "", objectID: "42", created_at: "2026-11-10T10:00:00Z" },
    { title: "Shared story about AI", url: "https://shared.example/story", objectID: "3", created_at: "2026-11-10T11:00:00Z" },
    { title: "", url: "https://example.com/empty", objectID: "4", created_at: "2026-11-10T11:00:00Z" },
  ],
});

export const RSS_LARGO = `<rss><channel><item><title>${"x".repeat(200)}</title><link>https://ars.example/1</link><pubDate>no es fecha</pubDate></item></channel></rss>`;
