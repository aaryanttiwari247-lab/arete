'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import {
  Sparkles,
  Sun,
  Moon,
  CloudMoon,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  LogIn,
  UserPlus,
  KeyRound,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { theme, cycleTheme } = useTheme();
  const { login, register, isAuthenticated } = useData();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Common OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginWithPassword, setLoginWithPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const resetFormState = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setOtpSent(false);
    setOtpCode('');
    setDevOtpHint(null);
  };

  // 1. Send OTP Request
  const handleSendOtp = async (targetEmail: string, targetType: 'login' | 'signup', name?: string) => {
    setError('');
    setSuccessMsg('');

    if (!targetEmail.trim() || !targetEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail.trim(),
          type: targetType,
          name: name?.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setOtpSent(true);
      setResendCountdown(45);
      setSuccessMsg(`Verification code sent to ${targetEmail.trim()}.`);
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

  // 2. Verify OTP and Complete Auth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    const email = mode === 'login' ? loginEmail.trim() : signupEmail.trim();
    const name = mode === 'signup' ? signupName.trim() : undefined;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otpCode.trim(),
          type: mode,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Verification code failed.');
      }

      if (mode === 'signup') {
        register(name || 'DayTrack User', email);
      } else {
        login(email);
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fallback Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(loginEmail.trim());
      setLoading(false);
      router.push('/dashboard');
    }, 300);
  };

  // 4. Quick direct enter for demo
  const handleQuickEnter = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      login('user@daytrack.app');
      router.push('/dashboard');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'medium') return <CloudMoon className="w-4 h-4 text-sky-400" />;
    return <Moon className="w-4 h-4 text-indigo-400" />;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-8 max-w-lg mx-auto w-full select-none">
      {/* Top Header with Brand & Theme Switcher */}
      <header className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">
              DayTrack
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
              Plan • Track • Improve
            </span>
          </div>
        </div>

        <button
          onClick={cycleTheme}
          title={`Appearance: ${theme}. Click to change.`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium transition-all active:scale-95"
        >
          {getThemeIcon()}
          <span className="capitalize">{theme}</span>
        </button>
      </header>

      {/* Main Center Box: TWO OPTIONS (Log In or Sign Up) */}
      <main className="my-auto py-6">
        <Card className="p-6 sm:p-8 shadow-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-translucent)] backdrop-blur-xl">
          {/* Two-Option Segment Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mb-6">
            <button
              type="button"
              onClick={() => resetFormState('login')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>

            <button
              type="button"
              onClick={() => resetFormState('signup')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Feedback Banners */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Developer Test Helper Pill */}
          {devOtpHint && (
            <div className="mb-4 p-2.5 rounded-lg bg-amber-500/10 border border-dashed border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
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

          {/* ═══════════════════════════════════════════════════════
              STEP 2: OTP CODE VERIFICATION (Used by both flows)
              ═══════════════════════════════════════════════════════ */}
          {otpSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-subtle)] text-[var(--accent-primary)] flex items-center justify-center mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Verify Email Address
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-semibold text-[var(--text-primary)]">
                    {mode === 'login' ? loginEmail : signupEmail}
                  </span>
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

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full mt-3 gap-2 shadow-md"
              >
                <span>Verify & Enter DayTrack</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                >
                  Change email
                </button>

                <button
                  type="button"
                  disabled={resendCountdown > 0 || loading}
                  onClick={() =>
                    mode === 'login'
                      ? handleSendOtp(loginEmail, 'login')
                      : handleSendOtp(signupEmail, 'signup', signupName)
                  }
                  className="flex items-center gap-1 text-[var(--accent-primary)] disabled:opacity-50 font-medium hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* ═══════════════════════════════════════════════════
                  OPTION 1: LOG IN
                  ═══════════════════════════════════════════════════ */}
              {mode === 'login' && (
                <div className="space-y-4">
                  <div className="space-y-1 mb-4">
                    <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                      Log in to DayTrack
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      Instant, secure access with email verification code.
                    </p>
                  </div>

                  {!loginWithPassword ? (
                    /* OTP Login Form */
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleSendOtp(loginEmail, 'login');
                      }}
                      className="space-y-4"
                    >
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        icon={<Mail className="w-4 h-4" />}
                        autoFocus
                      />

                      <Button
                        type="submit"
                        size="lg"
                        loading={loading}
                        className="w-full mt-2 gap-2 shadow-md"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Send Verification Code (OTP)</span>
                      </Button>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setLoginWithPassword(true)}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                        >
                          Or log in using password instead
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Password Login Form */
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={e => setLoginEmail(e.target.value)}
                        icon={<Mail className="w-4 h-4" />}
                        autoFocus
                      />

                      <div className="relative">
                        <Input
                          label="Password"
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          value={loginPassword}
                          onChange={e => setLoginPassword(e.target.value)}
                          icon={<Lock className="w-4 h-4" />}
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          title={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        loading={loading}
                        className="w-full mt-2 gap-2 shadow-md"
                      >
                        <span>Log In with Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => setLoginWithPassword(false)}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] underline"
                        >
                          ← Switch back to Email OTP verification
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="pt-3 text-center border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handleQuickEnter}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-4"
                    >
                      Direct enter without login (Demo Mode) →
                    </button>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════
                  OPTION 2: SIGN UP
                  ═══════════════════════════════════════════════════ */}
              {mode === 'signup' && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!signupName.trim()) {
                      setError('Please enter your full name.');
                      return;
                    }
                    if (signupPassword.length < 6) {
                      setError('Password must be at least 6 characters.');
                      return;
                    }
                    handleSendOtp(signupEmail, 'signup', signupName);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1 mb-4">
                    <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                      Create your account
                    </h2>
                    <p className="text-xs text-[var(--text-muted)]">
                      Verify your email address with OTP to get started.
                    </p>
                  </div>

                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Alex Morgan"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                    autoFocus
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-8 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="w-full mt-2 gap-2 shadow-md"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Send Verification Code & Continue</span>
                  </Button>

                  <div className="pt-3 text-center border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handleQuickEnter}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors underline underline-offset-4"
                    >
                      Direct enter as guest →
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </Card>
      </main>

      {/* Subtle Footer */}
      <footer className="text-center text-xs text-[var(--text-muted)] py-4">
        DayTrack • Secure Email OTP Verification & Client-First Architecture
      </footer>
    </div>
  );
}
