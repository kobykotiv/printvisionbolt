/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@printvisionbolt/ui"],
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com'
    ],
  },
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;