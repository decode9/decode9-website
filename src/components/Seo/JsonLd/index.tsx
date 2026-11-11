import type { JsonLdProps } from './interface';

/** Structured data of the page, rendered in the static HTML. */
const JsonLd = ({ data }: JsonLdProps) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;

export default JsonLd;
