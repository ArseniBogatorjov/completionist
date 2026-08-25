'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Lock, Mail, User, UserPlus } from 'lucide-react';
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
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label
          className="mb-2 block text-xs font-medium text-zinc-300"
          htmlFor="username"
        >
          Username
        </Label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors" />
          <Input
            id="username"
            type="text"
            required
            placeholder="john_doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10 border-white/10 bg-black/40 text-zinc-100 focus-visible:ring-1 focus-visible:ring-teal-400/50 transition-all duration-300"
          />
        </div>
      </div>

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
            type="email"
            required
            placeholder="joe@example.com"
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
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-white/10 bg-black/40 text-zinc-100 focus-visible:ring-1 focus-visible:ring-teal-400/50 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <Label
          className="mb-2 block text-xs font-medium text-zinc-300"
          htmlFor="confirm_password"
        >
          Confirm Password
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors" />
          <Input
            id="confirm_password"
            type="password"
            required
            placeholder="••••••••"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="pl-10 border-white/10 bg-black/40 text-zinc-100 focus-visible:ring-1 focus-visible:ring-teal-400/50 transition-all duration-300"
          />
        </div>
      </div>

      <div>
        <Label
          className="mb-2 block text-xs font-medium text-zinc-300"
          htmlFor="avatar"
        >
          Avatar URL (Optional)
        </Label>
        <div className="relative group">
          <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors" />
          <Input
            id="avatar"
            type="url"
            placeholder="https://example.com/avatar.png"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
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
        <UserPlus className="mr-2 h-4 w-4" />
        {loading ? 'Signing Up...' : 'Sign Up'}
      </Button>

      <p className="pt-2 text-center text-xs text-zinc-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-teal-400 underline-offset-4 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
