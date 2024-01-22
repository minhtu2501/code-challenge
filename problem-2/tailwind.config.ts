import type { Config } from 'tailwindcss';
import { shadcnPreset } from './lib/shadcn-preset';

const config = {
  presets: [shadcnPreset],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
} satisfies Config;

export default config;
