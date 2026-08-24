'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/apiClient';
import { registerSchema } from '@/lib/validations/auth.schema';

export function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    const result = registerSchema.safeParse({
      username,
      email,
      password,
      passwordConfirm,
      avatarUrl,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: result.data.username,
          email: result.data.email,
          password: result.data.password,
          avatarUrl: result.data.avatarUrl,
        }),
      });

      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during sign up.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label className="mb-2 block" htmlFor="username">
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            required
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 block" htmlFor="email">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            required
            placeholder="joe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 block" htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            required
            placeholder="Example123."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 block" htmlFor="confirm_password">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="confirm_password"
            type="password"
            required
            placeholder="Example123."
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="mb-2 block" htmlFor="avatar">
          Avatar URL (Optional)
        </Label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="avatar"
            type="url"
            placeholder="https://example.com/avatar.png"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-6">
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
