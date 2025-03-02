/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@printvisionbolt/shared-ui",
    "@printvisionbolt/utils"
  ],
  experimental: {
    optimizeCss: true,
    turbo: true,
  },
}

module.exports = nextConfig
