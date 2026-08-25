'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, LogIn, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/apiClient';
import { loginSchema } from '@/lib/validations/auth.schema';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: result.data.email,
          password: result.data.password,
        }),
      });

      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label
          className="mb-2 block text-xs font-medium text-zinc-300"
          htmlFor="email"
        >
          Email
        </Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors" />
          <Input
            id="email"
            placeholder="joe@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-white/10 bg-black/40 text-zinc-100 focus-visible:ring-1 focus-visible:ring-teal-400/50 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <Label
          className="mb-2 block text-xs font-medium text-zinc-300"
          htmlFor="password"
        >
          Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors" />
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-white/10 bg-black/40 text-zinc-100 focus-visible:ring-1 focus-visible:ring-teal-400/50 transition-all duration-300"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-2 border border-teal-400/50 bg-teal-400/10 text-teal-400 font-medium transition-all duration-300 hover:bg-teal-400 hover:text-black hover:shadow-[0_0_20px_rgba(102,252,241,0.35)] disabled:opacity-50"
      >
        <LogIn className="mr-2 h-4 w-4" />
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>

      <p className="pt-2 text-center text-xs text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-teal-400 underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
