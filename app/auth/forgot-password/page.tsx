'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.forgetPassword(email);
      toast.success('OTP sent to your email');
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&reset=true`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to send reset email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Forgot Password
          </h1>
          <p className="text-slate-500 mb-8">
            Enter your registered email address. we'll send you a code to reset
            your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 text-left">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-12 border-2 border-slate-300 focus:border-blue-500 rounded-lg px-4"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
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
