/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  reactStrictMode: true,
}

if (process.env.VERCEL) {
  module.exports = withPWA(nextConfig)
} else {
  module.exports = nextConfig
}
