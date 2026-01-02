import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle2, Info, XCircle, AlertTriangle } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-white text-gray-900 border-gray-200',
        info: 'bg-info-50 text-info-700 border-info-200 [&>svg]:text-info-600',
        success: 'bg-success-50 text-success-700 border-success-200 [&>svg]:text-success-600',
        warning: 'bg-warning-50 text-warning-700 border-warning-200 [&>svg]:text-warning-600',
        error: 'bg-error-50 text-error-700 border-error-200 [&>svg]:text-error-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode;
    showIcon?: boolean;
  }
>(({ className, variant, icon, showIcon = true, children, ...props }, ref) => {
  const Icon = iconMap[variant || 'default'];

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (icon || <Icon className="h-5 w-5" />)}
      {children}
    </div>
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
