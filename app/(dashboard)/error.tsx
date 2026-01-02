'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-error-600" />
          </div>
          <CardTitle className="text-2xl">Page Error</CardTitle>
          <CardDescription>
            Something went wrong loading this page. Please try again or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <Alert variant="destructive">
              <Bug className="h-4 w-4" />
              <AlertDescription className="font-mono text-xs mt-1 break-all">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {error.digest && (
            <p className="text-xs text-gray-500 text-center">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => window.history.back()}
              variant="secondary"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => (window.location.href = '/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
