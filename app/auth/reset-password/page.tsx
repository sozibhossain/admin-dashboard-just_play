'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      router.push('/auth/login');
    }
  }, [email, otp, router]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain an uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain a lowercase letter';
    }
    if (!/\d/.test(pwd)) {
      return 'Password must contain a number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!email || !otp) {
      toast.error('Invalid reset session');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(email, otp, password);
      toast.success('Password reset successfully');
      router.push('/auth/login');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to reset password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !otp) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Reset Password
          </h1>
          <p className="text-slate-500 mb-8">Create your new password</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 text-left">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 border-2 border-slate-300 focus:border-blue-500 rounded-lg px-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="text-xs text-slate-500 text-left mt-2">
                  <p className={password.length >= 8 ? 'text-green-600' : ''}>
                    ✓ At least 8 characters
                  </p>
                  <p
                    className={
                      /[A-Z]/.test(password) ? 'text-green-600' : ''
                    }
                  >
                    ✓ Contains uppercase letter
                  </p>
                  <p
                    className={
                      /[a-z]/.test(password) ? 'text-green-600' : ''
                    }
                  >
                    ✓ Contains lowercase letter
                  </p>
                  <p className={/\d/.test(password) ? 'text-green-600' : ''}>
                    ✓ Contains number
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 text-left">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-12 border-2 border-slate-300 focus:border-blue-500 rounded-lg px-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-600 text-left">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-semibold rounded-lg transition-colors disabled:opacity-50 mt-6"
            >
              {isLoading ? 'Updating...' : 'Continue'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-slate-600">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/auth/login')}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
