import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import '@/app/globals.css'
import '@/styles/typography.css'
import '@/styles/themes/light.css'
import '@/styles/themes/dark.css'
import '@/styles/themes/sepia.css'

const cormorant = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
  preload: true,
})

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-jetbrains',
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: 'Наталья Мельхер — Литературная платформа',
    template: '%s — Наталья Мельхер',
  },
  description:
    'Поэзия, проза, эссе и размышления. Художественная платформа, где тексты воспринимаются как форма искусства.',
  keywords: [
    'Наталья Мельхер',
    'поэзия',
    'проза',
    'литература',
    'стихи',
    'эссе',
  ],
  authors: [{ name: 'Наталья Мельхер' }],
  creator: 'Наталья Мельхер',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Наталья Мельхер',
    title: 'Наталья Мельхер — Литературная платформа',
    description:
      'Поэзия, проза, эссе и размышления.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Наталья Мельхер — Литературная платформа',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF8' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('melkher-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else if (theme === 'sepia') {
                    document.documentElement.classList.add('sepia-theme');
                    document.documentElement.setAttribute('data-theme', 'sepia');
                  } else if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <SmoothScrollProvider>
            <div className="noise-overlay" aria-hidden="true" />
            <div className="page-wrapper">
              {children}
            </div>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}