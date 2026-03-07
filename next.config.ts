import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* ── Turbopack Configuration (Next.js 16+) ──────────── */
  turbopack: {},

  /* ── Images ─────────────────────────────────────────── */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* ── Experimental ───────────────────────────────────── */
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'gsap',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
  },

  /* ── Security Headers ───────────────────────────────── */
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0',
        },
      ],
    },
  ],

  /* ── Redirects ──────────────────────────────────────── */
  redirects: async () => [
    {
      source: '/',
      destination: '/ru',
      permanent: false,
    },
  ],

  /* ── Server External Packages ───────────────────────── */
  serverExternalPackages: ['better-sqlite3', 'bcryptjs'],
}

export default nextConfig