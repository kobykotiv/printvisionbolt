/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@printvisionbolt/shared-ui",
    "@printvisionbolt/utils"
  ],
  experimental: {
    optimizeCss: true,
    turbo: {
      loaders: {
        '.js': ['@swc/loader'],
        '.ts': ['@swc/loader'],
        '.tsx': ['@swc/loader']
      }
    }
  }
}

module.exports = nextConfig
