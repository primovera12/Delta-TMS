'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full rounded-md border bg-white px-3 py-2 text-base text-gray-900 transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-200 hover:border-gray-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20',
        error:
          'border-error-500 hover:border-error-600 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20',
        success:
          'border-success-500 hover:border-success-600 focus-visible:border-success-500 focus-visible:ring-2 focus-visible:ring-success-500/20',
      },
      inputSize: {
        sm: 'h-8 text-sm px-2',
        default: 'h-10',
        lg: 'h-12 text-lg px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      leftIcon,
      rightIcon,
      error,
      ...props
    },
    ref
  ) => {
    const actualVariant = error ? 'error' : variant;

    if (leftIcon || rightIcon) {
      return (
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: actualVariant, inputSize }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: actualVariant, inputSize }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
