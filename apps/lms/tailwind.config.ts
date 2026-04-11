import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // K9 Design System LMS Palette
        cream: {
          50: '#F7F3ED',
          100: '#E9E1D7',
        },
        teal: {
          400: '#A7B8AE',
          700: '#1E4F4F',
          900: '#0F2F2F',
        },
        coral: {
          300: '#F4A99A',
          500: '#E58C73',
          700: '#C46C55',
        },
        // Semantic aliases
        'lms-bg': '#F7F3ED',
        'lms-surface': '#E9E1D7',
        'lms-primary': '#1E4F4F',
        'lms-primary-dark': '#0F2F2F',
        'lms-primary-muted': '#A7B8AE',
        'lms-accent': '#E58C73',
      },
      fontFamily: {
        heading: ['Brandon Grotesque', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
