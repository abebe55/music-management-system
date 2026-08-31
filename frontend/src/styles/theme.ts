export const theme = {
  colors: {
    primary: '#6c63ff',
    primaryLight: '#f0eeff',
    primaryDark: '#5a52d5',
    secondary: '#ff6584',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    info: '#3b82f6',

    // Neutrals
    white: '#ffffff',
    black: '#000000',
    background: '#f8f9fc',
    surface: '#ffffff',
    surfaceHover: '#f5f5f5',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',

    // Text
    textPrimary: '#1a1a2e',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    textInverse: '#ffffff',

    // Sidebar
    sidebarBg: '#ffffff',
    sidebarActive: '#f0eeff',
    sidebarActiveText: '#6c63ff',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
    lg: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
    xl: '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
    card: '0 2px 8px rgba(0,0,0,0.08)',
  },
  transitions: {
    fast: '150ms ease',
    base: '200ms ease',
    slow: '300ms ease',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  zIndex: {
    dropdown: 100,
    modal: 200,
    toast: 300,
  },
  layout: {
    sidebarWidth: '216px',   // reduced ~10% from 240px
    headerHeight: '52px',    // slightly reduced from 64px
  },
} as const;

export type Theme = typeof theme;
