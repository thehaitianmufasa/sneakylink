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
        primary: '#D32F2F', // Emergency Red
        secondary: '#1976D2', // Trust Blue
        accent: '#F57C00', // Warm Orange
        'light-gray': '#F5F5F5',
        'dark-gray': '#2C3E50',
        text: '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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
