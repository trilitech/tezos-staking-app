/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    appDir: true
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }
    return config
  },
}

export default nextConfig
