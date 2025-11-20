/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'neighborly.griffinbaker.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3002',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Security: Enhanced headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security: Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Security: Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Security: XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Security: Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Security: Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ]
      },
      // Security: API routes
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ]
      },
    ]
  },
  // Security: Output configuration
  output: 'standalone',
  // Security: Disable powered by header
  poweredByHeader: false,
  // Security: Compress responses
  compress: true,
  // Security: Strict mode
  reactStrictMode: true,
  // Performance: Enable experimental features
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Performance: Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Security: Disable source maps in production
    if (!dev && !isServer) {
      config.devtool = false
    }
    
    // Security: Minimize bundle
    config.optimization.minimize = true
    
    return config
  },
  // Temporarily disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig








