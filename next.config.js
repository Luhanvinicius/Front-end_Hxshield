/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuração para API routes
  async rewrites() {
    return [];
  },
}

module.exports = nextConfig








