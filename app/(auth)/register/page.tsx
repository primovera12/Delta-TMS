'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [registrationComplete, setRegistrationComplete] = React.useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      acceptTerms: false,
    },
    mode: 'onBlur',
  });

  const password = watch('password');

  // Password strength indicator
  const passwordStrength = React.useMemo(() => {
    if (!password) return { score: 0, label: 'Enter a password', color: 'bg-gray-200' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-error-500' };
    if (score <= 4) return { score: 2, label: 'Fair', color: 'bg-warning-500' };
    return { score: 3, label: 'Strong', color: 'bg-success-500' };
  }, [password]);

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? ['firstName', 'lastName', 'email', 'phone']
        : ['password', 'confirmPassword'];

    const isValid = await trigger(fieldsToValidate as (keyof RegisterFormData)[]);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implement actual registration with API
      console.log('Registration data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setRegistrationComplete(true);
    } catch {
      // Handle error
      setIsLoading(false);
    }
  };

  if (registrationComplete) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-success-50 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-500 mb-6">
            We&apos;ve sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
          </p>
          <Button onClick={() => router.push('/login')} className="w-full">
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Step {step} of 3 - {step === 1 ? 'Personal Info' : step === 2 ? 'Security' : 'Confirmation'}
        </CardDescription>

        {/* Progress bar */}
        <div className="flex gap-2 pt-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" required>
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    leftIcon={<User className="h-4 w-4" />}
                    error={!!errors.firstName}
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-error-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" required>
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    error={!!errors.lastName}
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-error-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" required>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" required>
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  leftIcon={<Phone className="h-4 w-4" />}
                  error={!!errors.phone}
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-sm text-error-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth (Optional)
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  leftIcon={<Calendar className="h-4 w-4" />}
                  {...register('dateOfBirth')}
                />
              </div>

              <Button type="button" onClick={nextStep} className="w-full" size="lg">
                Continue
              </Button>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" required>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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

                {/* Password strength */}
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.score
                            ? passwordStrength.color
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{passwordStrength.label}</p>
                </div>

                {errors.password && (
                  <p className="text-sm text-error-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    leftIcon={<Lock className="h-4 w-4" />}
                    error={!!errors.confirmPassword}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-error-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={prevStep} variant="secondary" className="flex-1" size="lg">
                  Back
                </Button>
                <Button type="button" onClick={nextStep} className="flex-1" size="lg">
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <>
              <Alert variant="info" className="mb-4">
                <AlertDescription>
                  Please review your information before creating your account.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Name</span>
                  <span className="text-sm font-medium text-gray-900">
                    {watch('firstName')} {watch('lastName')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{watch('email')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone</span>
                  <span className="text-sm font-medium text-gray-900">{watch('phone')}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="acceptTerms" {...register('acceptTerms')} />
                <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-error-600">{errors.acceptTerms.message}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={prevStep} variant="secondary" className="flex-1" size="lg">
                  Back
                </Button>
                <Button type="submit" className="flex-1" size="lg" loading={isLoading}>
                  Create Account
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
