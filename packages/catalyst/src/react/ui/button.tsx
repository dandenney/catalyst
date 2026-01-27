import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--catalyst-radius-sm)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--catalyst-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--catalyst-primary)] text-[var(--catalyst-primary-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-primary-hover)]',
        destructive:
          'bg-[var(--catalyst-destructive)] text-[var(--catalyst-destructive-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-destructive-hover)]',
        outline:
          'border border-[var(--catalyst-border-input)] bg-[var(--catalyst-background)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-secondary)] text-[var(--catalyst-foreground)]',
        secondary:
          'bg-[var(--catalyst-secondary)] text-[var(--catalyst-secondary-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-secondary-hover)]',
        ghost:
          'hover:bg-[var(--catalyst-secondary)] text-[var(--catalyst-foreground)]',
        link: 'text-[var(--catalyst-primary)] underline-offset-4 hover:underline',
        accent:
          'bg-[var(--catalyst-accent)] text-[var(--catalyst-accent-foreground)] shadow-[var(--catalyst-shadow-sm)] hover:bg-[var(--catalyst-accent-hover)]',
        success:
          'bg-[var(--catalyst-success)] text-[var(--catalyst-success-foreground)] shadow-[var(--catalyst-shadow-sm)]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-[var(--catalyst-radius-sm)] px-3 text-xs',
        lg: 'h-10 rounded-[var(--catalyst-radius-md)] px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
