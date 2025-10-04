import { cn } from '@/lib/utils/cn';

export const buttonVariants = {
  default: 'bg-foreground text-background hover:bg-foreground/90',
  primary: 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-sm',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-dark shadow-sm',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  outline: 'border-2 border-border bg-background hover:bg-muted hover:border-primary/50 transition-all',
  ghost: 'hover:bg-muted hover:text-foreground transition-colors',
  success: 'bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm font-medium',
} as const;

export const buttonSizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
} as const;

export const badgeVariants = {
  primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-colors',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15 transition-colors',
  accent: 'bg-accent/15 text-accent-dark border-accent/30 hover:bg-accent/20 transition-colors',
  success: 'bg-success-light text-success border-success/20 hover:bg-success-light/80 transition-colors',
  warning: 'bg-warning-light text-warning border-warning/20 hover:bg-warning-light/80 transition-colors',
  info: 'bg-info-light text-info border-info/20 hover:bg-info-light/80 transition-colors',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/15 transition-colors',
  muted: 'bg-muted text-muted-foreground border-border hover:bg-muted/80 transition-colors',
} as const;

export const textVariants = {
  heading: 'font-bold text-foreground',
  subheading: 'font-semibold text-foreground',
  body: 'text-foreground',
  muted: 'text-muted-foreground',
  small: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground',
} as const;

export const cardVariants = {
  default: 'bg-card text-card-foreground rounded-lg border border-border shadow-sm',
  elevated: 'bg-card text-card-foreground rounded-lg border border-border shadow-md hover:shadow-lg transition-shadow duration-200',
  interactive: 'bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:shadow-md hover:border-primary/40 hover:scale-[1.01] transition-all duration-200 cursor-pointer',
  highlighted: 'bg-card text-card-foreground rounded-lg border-2 border-primary shadow-md',
} as const;

export const navVariants = {
  default: 'bg-card',
  sticky: 'bg-card/95 backdrop-blur-sm sticky top-0 z-50',
  floating: 'bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-lg',
} as const;

export function getVariant<T extends Record<string, string>>(
  variants: T,
  variant: keyof T,
  className?: string
): string {
  return cn(variants[variant], className);
}
