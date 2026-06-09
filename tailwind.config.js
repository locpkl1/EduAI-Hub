/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: 'var(--color-bg)',
        'bg-card': 'var(--color-bg-card)',
        'bg-muted': 'var(--color-bg-muted)',
        'bg-accent': 'var(--color-bg-accent)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-light': 'var(--color-text-light)',
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        accent: 'var(--color-accent)',
        'accent-light': 'var(--color-accent-light)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        theme: 'var(--radius)',
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 24px -4px rgba(0,0,0,0.14)',
        glow: '0 0 24px -6px var(--color-primary)',
      },
    },
  },
  plugins: [],
};
