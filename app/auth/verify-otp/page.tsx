'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';
import { Mail } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const isReset = searchParams.get('reset') === 'true';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      router.push('/auth/login');
    }
  }, [email, router]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
    if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    if (!email) {
      toast.error('Email not found');
      return;
    }

    setIsLoading(true);
    try {
      if (isReset) {
        router.push(
          `/auth/reset-password?email=${email}&otp=${otpCode}`
        );
      } else {
        await authApi.verifyEmail(email, otpCode);
        toast.success('Email verified successfully');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      if (isReset && email) {
        await authApi.forgetPassword(email);
      }
      toast.success('OTP resent successfully');
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Enter OTP
          </h1>
          <p className="text-slate-500 mb-8">
            We have shared a code of your registered email address
            <br />
            <span className="font-semibold text-slate-700">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 border-2 border-slate-300 rounded-lg text-center text-2xl font-bold focus:border-blue-500 focus:outline-none transition-colors"
                  autoComplete="off"
                  inputMode="numeric"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-slate-600 mb-4">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {canResend ? 'Resend OTP' : `Resend in ${timer}s`}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
