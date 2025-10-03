export const colors = {
  primary: {
    DEFAULT: 'hsl(142 45% 45%)',
    light: 'hsl(142 40% 60%)',
    dark: 'hsl(142 50% 35%)',
    foreground: 'hsl(0 0% 100%)',
  },
  secondary: {
    DEFAULT: 'hsl(25 70% 55%)',
    light: 'hsl(25 65% 68%)',
    dark: 'hsl(25 75% 45%)',
    foreground: 'hsl(0 0% 100%)',
  },
  accent: {
    DEFAULT: 'hsl(45 90% 60%)',
    light: 'hsl(45 85% 72%)',
    dark: 'hsl(45 95% 50%)',
    foreground: 'hsl(25 20% 20%)',
  },
  success: {
    DEFAULT: 'hsl(120 45% 45%)',
    light: 'hsl(120 40% 92%)',
  },
  warning: {
    DEFAULT: 'hsl(38 92% 50%)',
    light: 'hsl(38 90% 95%)',
  },
  info: {
    DEFAULT: 'hsl(200 80% 50%)',
    light: 'hsl(200 75% 92%)',
  },
  destructive: {
    DEFAULT: 'hsl(0 70% 55%)',
    foreground: 'hsl(0 0% 100%)',
  },
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const radius = {
  sm: 'calc(var(--radius) - 0.25rem)',
  md: 'var(--radius)',
  lg: 'calc(var(--radius) + 0.25rem)',
  full: '9999px',
} as const;

export const typography = {
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
} as const;
