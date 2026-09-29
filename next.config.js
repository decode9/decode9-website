/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves static files only: every route is pre-rendered to /out.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
