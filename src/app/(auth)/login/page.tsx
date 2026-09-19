'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { useData } from '@/context/DataContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useData();

  const [email, setEmail] = useState('alex.morgan@daytrack.app');
  const [password, setPassword] = useState('correct-horse-battery-staple');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(email);
      setLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('alex.morgan@daytrack.app');
    setPassword('demo-password-2026');
    setLoading(true);
    setTimeout(() => {
      login('alex.morgan@daytrack.app');
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <Card className="border border-[var(--border-subtle)] shadow-xl">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to access your routines, habits, and daily tracking.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="alex.morgan@daytrack.app"
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
              autoComplete="current-password"
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

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--text-secondary)] select-none">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={e => setRememberSession(e.target.checked)}
                className="rounded border-[var(--border-subtle)] accent-[var(--accent-primary)] w-3.5 h-3.5"
              />
              <span>Remember session</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-[var(--accent-primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={loading} className="w-full py-2.5 mt-2">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[var(--bg-surface)] px-2 text-[var(--text-muted)]">
              Or quick test
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleDemoLogin}
          className="w-full text-xs font-semibold py-2"
        >
          <ShieldCheck className="w-4 h-4 mr-1 text-[var(--accent-primary)]" />
          Continue with Demo Account (Alex Morgan)
        </Button>

        <p className="text-center text-xs text-[var(--text-muted)] pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-[var(--accent-primary)] font-semibold hover:underline">
            Register now
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
