import * as React from 'react';
import { cn } from '../lib/utils';

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn(
          'block text-xs font-semibold text-[var(--catalyst-secondary-foreground)] mb-1',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = 'Label';

export { Label };
