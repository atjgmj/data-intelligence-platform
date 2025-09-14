/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Allow large file uploads
  experimental: {
    largePageDataBytes: 128 * 100000, // 128MB
  },
  // Images optimization
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig