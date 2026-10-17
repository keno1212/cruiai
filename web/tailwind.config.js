/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        base: 'var(--c-bg)',
        elevated: 'var(--c-elevated)',
        surface: 'var(--c-surface)',
        hover: 'var(--c-hover)',
        line: 'var(--c-border)',
        amber: 'var(--c-amber)',
        cyber: 'var(--c-cyan)',
        fg: 'var(--c-text)',
        dim: 'var(--c-text-dim)',
        muted: 'var(--c-text-muted)'
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      maxWidth: {
        container: '1200px'
      }
    }
  },
  plugins: []
}
