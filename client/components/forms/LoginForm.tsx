'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';
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

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: result.data.email,
          password: result.data.password,
        }),
      });

      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during sign in.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label className="mb-2 block" htmlFor="email">
          Enter your email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            placeholder="joe@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 block" htmlFor="password">
          Enter your password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            placeholder="Example123."
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-5">
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
