/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    }
    return config
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react']
  }
}

export default nextConfig
