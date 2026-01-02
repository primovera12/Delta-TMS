'use client';

import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, getSession } from 'next-auth/react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';

// Role-based dashboard paths
const dashboardPaths: Record<string, string> = {
  admin: '/admin',
  super_admin: '/admin',
  operations_manager: '/dispatcher',
  dispatcher: '/dispatcher',
  driver: '/driver',
  facility_staff: '/facility',
  family_member: '/family',
  patient: '/patient',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const error = searchParams.get('error');

  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(
    error === 'CredentialsSignin' ? 'Invalid email or password' : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Get the session to determine the user's role
      const session = await getSession();
      const role = session?.user?.role?.toLowerCase() || 'patient';

      // Use callbackUrl if provided (e.g., returning to a protected page),
      // otherwise redirect to role-based dashboard
      const redirectPath = callbackUrl || dashboardPaths[role] || '/patient';

      router.push(redirectPath);
      router.refresh();
    } catch {
      setAuthError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Alert */}
          {authError && (
            <Alert variant="error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-error-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={!!errors.password}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-error-600">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" {...register('rememberMe')} />
            <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
          >
            Sign in
          </Button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Create account
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm">
          <p className="font-medium text-gray-700 mb-2">Demo Accounts (password: password123):</p>
          <div className="grid grid-cols-2 gap-1 text-gray-600">
            <p><span className="font-mono text-xs">admin@delta.com</span></p>
            <p className="text-right text-xs text-gray-500">Admin</p>
            <p><span className="font-mono text-xs">dispatcher@delta.com</span></p>
            <p className="text-right text-xs text-gray-500">Dispatcher</p>
            <p><span className="font-mono text-xs">driver@delta.com</span></p>
            <p className="text-right text-xs text-gray-500">Driver</p>
            <p><span className="font-mono text-xs">facility@delta.com</span></p>
            <p className="text-right text-xs text-gray-500">Facility</p>
            <p><span className="font-mono text-xs">patient@delta.com</span></p>
            <p className="text-right text-xs text-gray-500">Patient</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginFormFallback() {
  return (
    <Card className="shadow-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
