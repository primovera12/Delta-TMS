'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [sentEmail, setSentEmail] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual password reset API call
      console.log('Reset password for:', data.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSentEmail(data.email);
      setEmailSent(true);
    } catch {
      // Handle error
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-success-50 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-500 mb-6">
            We&apos;ve sent password reset instructions to{' '}
            <span className="font-medium text-gray-900">{sentEmail}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              try again
            </button>
          </p>
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" required>
              Email address
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

          <Button type="submit" className="w-full" size="lg" loading={isLoading}>
            Send reset instructions
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
