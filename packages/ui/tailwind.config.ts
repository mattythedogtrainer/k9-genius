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
        navy: '#1B4F72',
        gold: '#F39C12',
        'dark-bg': '#0f1419',
        card: '#1a2332',
        'card-hover': '#1f2b3d',
      },
    },
  },
  plugins: [],
};

export default config;
