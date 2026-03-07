import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FEFDFB',
          100: '#FAFAF8',
          200: '#F5F5F0',
          300: '#F0EBE0',
          400: '#E8E4DC',
          500: '#D8CEAF',
          600: '#C4A882',
          700: '#8B7355',
          800: '#6B5A3E',
          900: '#4A3D2A',
        },
        midnight: {
          50: '#2A2A2C',
          100: '#1E1E20',
          200: '#1A1A1C',
          300: '#161618',
          400: '#141416',
          500: '#111113',
          600: '#0E0E10',
          700: '#0C0C0D',
          800: '#0A0A0B',
          900: '#050506',
        },
        bronze: {
          50: '#F5EDE0',
          100: '#EBD9C1',
          200: '#D4BE9C',
          300: '#C4A882',
          400: '#B8956A',
          500: '#8B7355',
          600: '#7A6448',
          700: '#65523B',
          800: '#4F402F',
          900: '#3A2F22',
        },
        sepia: {
          50: '#F4EEDB',
          100: '#EDE7D4',
          200: '#E5DDCA',
          300: '#D8CEAF',
          400: '#C4B48A',
          500: '#A6935F',
          600: '#8B6914',
          700: '#7A6C5B',
          800: '#5A4E3E',
          900: '#3E3428',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          light: '#6B6B6B',
          lighter: '#8A8A8A',
          dark: '#0D0D0D',
        },
        parchment: {
          DEFAULT: '#FAFAF8',
          warm: '#F5F5F0',
          aged: '#F0EBE0',
          dark: '#E8E4DC',
        },
      },

      fontFamily: {
        heading: [
          'Cormorant Garamond',
          'Cormorant',
          'Georgia',
          'Times New Roman',
          'serif',
        ],
        body: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        literary: [
          'Cormorant Garamond',
          'EB Garamond',
          'Georgia',
          'serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
      },

      fontSize: {
        'hero-mobile': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-desktop': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'section-mobile': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'section-desktop': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'literary': ['1.375rem', { lineHeight: '2', letterSpacing: '0.01em' }],
        'literary-mobile': ['1.125rem', { lineHeight: '1.9', letterSpacing: '0.01em' }],
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },

      maxWidth: {
        'reading': '42rem',
        'literary': '38rem',
        'content': '64rem',
        'wide': '80rem',
      },

      borderRadius: {
        'elegant': '0.375rem',
        'soft': '0.75rem',
        'artistic': '1.5rem',
      },

      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'literary': '0 20px 40px -12px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 20px rgba(196, 168, 130, 0.15)',
        'glow-strong': '0 0 40px rgba(196, 168, 130, 0.25)',
      },

      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-slow': 'fadeIn 1.2s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-up-slow': 'slideUp 1.2s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'text-reveal': 'textReveal 1.2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'ink-spread': 'inkSpread 1.5s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        inkSpread: {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },

      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },

      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'dramatic': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-literary': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'noise': "url('/images/backgrounds/noise.png')",
      },

      typography: {
        literary: {
          css: {
            '--tw-prose-body': '#1A1A1A',
            '--tw-prose-headings': '#1A1A1A',
            maxWidth: '38rem',
            fontSize: '1.375rem',
            lineHeight: '2',
            'p': {
              marginTop: '1.5em',
              marginBottom: '1.5em',
              textIndent: '1.5em',
            },
            'p:first-of-type': {
              textIndent: '0',
            },
            'blockquote': {
              fontStyle: 'italic',
              borderLeftColor: '#C4A882',
              borderLeftWidth: '2px',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config