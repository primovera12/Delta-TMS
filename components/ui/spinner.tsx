import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export function Spinner({ size = 'default', className }: SpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary-600', sizeClasses[size], className)}
    />
  );
}

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

export function Loading({ fullScreen, text }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}
