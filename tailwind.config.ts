import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Compliance Clarity Theme
        'trust-blue': '#2563eb',      // Primary actions, builds trust
        'success-green': '#10b981',   // Completion indicators
        'warning-amber': '#f59e0b',   // Action needed
        'neutral-slate': '#475569',   // Body text
        'light-bg': '#f8fafc',        // Page backgrounds
        'danger-red': '#ef4444',      // Critical items
        // Legacy colors (kept for backwards compatibility)
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        'light-gray': '#F5F5F5',
        'dark-gray': '#2C3E50',
        text: '#475569',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
      },
      spacing: {
        section: '80px',
        'section-mobile': '40px',
      },
    },
  },
  plugins: [],
}
export default config
