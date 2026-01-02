'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-base text-gray-900 transition-all duration-150 placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          error
            ? 'border-error-500 focus-visible:border-error-500 focus-visible:ring-2 focus-visible:ring-error-500/20'
            : 'border-gray-200 hover:border-gray-300 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
