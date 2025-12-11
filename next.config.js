/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Support external directories (clean architecture)
  experimental: {
    externalDir: true,
  },

  // Image configuration
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'xgfkhrxabdkjkzduvqnu.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.clerk.com' }
    ],
    formats: ['image/avif', 'image/webp']
  },

  env: {
    NEXT_PUBLIC_APP_NAME: 'Sneakylink'
  }
}

module.exports = nextConfig
