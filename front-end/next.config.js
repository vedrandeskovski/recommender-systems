/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    // Ignore ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
