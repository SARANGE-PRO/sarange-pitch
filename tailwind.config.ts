import type { Config } from 'tailwindcss';

/**
 * Charte « Lanna Futur » — un temple thaïlandais numérisé.
 * Mode sombre par défaut, matières traditionnelles (or, laque, jade, teal récif)
 * traitées comme une interface holographique nocturne.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fonds
        night: '#0B1A15', // Nuit de jungle — fond principal
        lacquer: '#122A21', // Laque profonde — cartes / surfaces
        'lacquer-2': '#0F2119', // Variante plus sombre pour la profondeur
        // Textes
        ivory: '#F4EEDD', // Ivoire soie — texte principal
        sand: '#A9B5AC', // Sable atténué — texte secondaire
        // Accents
        gold: '#C9A227', // Or de temple
        teal: '#17A398', // Teal récif
        // Dangerosité
        jade: '#4C9A6A', // Sûr
        'amber-warn': '#D0912B', // Prudence
        laque: '#B8302A', // Dangereux
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        ui: ['var(--font-chakra)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      borderColor: {
        line: 'rgba(244,238,221,0.10)',
      },
      backgroundColor: {
        line: 'rgba(244,238,221,0.10)',
      },
      boxShadow: {
        'gold-halo': '0 0 0 1px rgba(201,162,39,0.35), 0 12px 40px -12px rgba(201,162,39,0.30)',
        'teal-halo': '0 0 0 1px rgba(23,163,152,0.35), 0 12px 40px -12px rgba(23,163,152,0.30)',
        card: '0 10px 30px -18px rgba(0,0,0,0.75)',
      },
      keyframes: {
        pulseMarker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(1.35)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-marker': 'pulseMarker 2.4s ease-in-out infinite',
        scan: 'scanline 2.2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease both',
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
    },
  },
  plugins: [],
};

export default config;
