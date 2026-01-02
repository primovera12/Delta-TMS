'use client';

import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileQuestion className="h-10 w-10 text-gray-400" />
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900">404</CardTitle>
          <CardDescription className="text-lg">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="space-y-3">
            <Link href="/" passHref>
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => typeof window !== 'undefined' && window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Looking for something specific?
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/dispatcher"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              >
                Dispatcher Dashboard
              </Link>
              <Link
                href="/admin"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              >
                Admin Panel
              </Link>
              <Link
                href="/driver"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              >
                Driver Portal
              </Link>
              <Link
                href="/patient"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              >
                Patient Portal
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
