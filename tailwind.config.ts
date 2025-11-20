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
        tansy: {
          teal: '#4FD1C7',
          'teal-dark': '#38B2AC',
          'teal-light': '#81E6D9',
          pink: '#F687B3',
          'pink-light': '#FBB6CE',
          'pink-dark': '#ED64A6',
          gray: {
            light: '#F7FAFC',
            DEFAULT: '#E2E8F0',
            dark: '#718096',
            darker: '#2D3748',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config

