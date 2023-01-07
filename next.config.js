/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    runtime: 'experimental-edge',
    regions: ['sfo1']
  },
  reactStrictMode: true,
}

module.exports = nextConfig
