import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-primary-50 text-primary-700',
        secondary: 'bg-gray-100 text-gray-600',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-error-50 text-error-700',
        info: 'bg-info-50 text-info-700',
        outline: 'border border-gray-200 text-gray-700 bg-transparent',
        // Trip status variants
        pending: 'bg-warning-50 text-warning-700',
        confirmed: 'bg-primary-50 text-primary-700',
        assigned: 'bg-purple-50 text-purple-700',
        'driver-en-route': 'bg-cyan-50 text-cyan-700',
        'driver-arrived': 'bg-emerald-50 text-emerald-700',
        'in-progress': 'bg-success-50 text-success-700',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-error-50 text-error-700',
        'no-show': 'bg-red-100 text-red-800',
        // Driver status variants
        online: 'bg-success-50 text-success-700',
        offline: 'bg-gray-100 text-gray-600',
        busy: 'bg-warning-50 text-warning-700',
        'on-trip': 'bg-primary-50 text-primary-700',
        break: 'bg-purple-50 text-purple-700',
        // Role variants
        admin: 'bg-purple-50 text-purple-700',
        dispatcher: 'bg-primary-50 text-primary-700',
        driver: 'bg-cyan-50 text-cyan-700',
        facility: 'bg-amber-50 text-amber-700',
        patient: 'bg-emerald-50 text-emerald-700',
        family: 'bg-pink-50 text-pink-700',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        default: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
