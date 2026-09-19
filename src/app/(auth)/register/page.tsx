'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { useData } from '@/context/DataContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the terms of service.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), type: 'signup', name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setOtpSent(true);
      setResendCountdown(45);
      setSuccessMsg(`Verification code sent to ${email.trim()}`);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpCode.trim(),
          type: 'signup',
          name: name.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Verification code failed.');
      }

      register(name.trim(), email.trim());
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-[var(--border-subtle)] shadow-xl">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl">Create Your Account</CardTitle>
        <CardDescription>
          {otpSent
            ? 'Confirm your email address with the verification code.'
            : "Begin your journey with DayTrack's deliberate tracking system."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && !error && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {devOtpHint && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span className="font-mono">
              🧪 Dev OTP: <strong>{devOtpHint}</strong>
            </span>
            <button
              type="button"
              onClick={() => setOtpCode(devOtpHint)}
              className="text-[11px] underline hover:text-white font-medium"
            >
              Auto-fill
            </button>
          </div>
        )}

        {otpSent ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center mb-1">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                Check your inbox
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                We sent a 6-digit verification code to <span className="font-semibold text-[var(--text-primary)]">{email}</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoFocus
                className="w-full text-center tracking-[12px] font-mono text-2xl py-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full py-2.5 mt-2 gap-2">
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
              >
                Change details
              </button>

              <button
                type="button"
                disabled={resendCountdown > 0 || loading}
                onClick={handleSendOtp}
                className="flex items-center gap-1 text-[var(--accent-primary)] disabled:opacity-50 font-medium hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="Alex Morgan"
              value={name}
              onChange={e => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
              autoComplete="name"
              autoFocus
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password (min. 6 characters)"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-8 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
              autoComplete="new-password"
            />

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--text-secondary)] select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[var(--border-subtle)] accent-[var(--accent-primary)] w-3.5 h-3.5"
                />
                <span className="leading-normal">
                  I agree to the <span className="text-[var(--accent-primary)] underline">Terms of Service</span> and privacy policy.
                </span>
              </label>
            </div>

            <Button type="submit" loading={loading} className="w-full py-2.5 mt-2 gap-2">
              <KeyRound className="w-4 h-4" />
              <span>Verify Email with OTP</span>
            </Button>
          </form>
        )}

        <p className="text-center text-xs text-[var(--text-muted)] pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--accent-primary)] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
