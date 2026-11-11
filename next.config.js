/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves static files only: every route is pre-rendered to /out.
  output: 'export',
  // Parallel dev servers (one per migration agent) need their own build folder.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
