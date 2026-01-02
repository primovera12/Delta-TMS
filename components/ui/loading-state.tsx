'use client';

import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Skeleton } from './skeleton';

interface LoadingStateProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  minHeight?: string;
}

/**
 * A wrapper component that handles loading and error states
 */
export function LoadingState({
  loading = false,
  error = null,
  onRetry,
  children,
  skeleton,
  minHeight = '200px',
}: LoadingStateProps) {
  if (loading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }

    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-error-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-error-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Error loading data</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
            </div>
            {onRetry && (
              <Button onClick={onRetry} variant="secondary" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * A simple loading spinner with optional text
 */
export function LoadingSpinner({
  size = 'md',
  text,
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton for table loading states
 */
export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={`h-5 flex-1 ${colIndex === 0 ? 'w-8' : ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  lines?: number;
  showAvatar?: boolean;
  showAction?: boolean;
}

/**
 * Skeleton for card loading states
 */
export function CardSkeleton({
  lines = 2,
  showAvatar = false,
  showAction = false,
}: CardSkeletonProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />}
          <div className="flex-1 space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-4 ${i === 0 ? 'w-3/4' : 'w-1/2'}`}
              />
            ))}
          </div>
          {showAction && <Skeleton className="h-8 w-20 flex-shrink-0" />}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Full-page loading overlay
 */
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-primary-600 animate-spin" />
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
