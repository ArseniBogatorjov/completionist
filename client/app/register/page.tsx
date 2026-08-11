'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character (@$!%*?&).',
      );
      return;
    }

    try {
      await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          avatarUrl: avatarUrl.trim() === '' ? null : avatarUrl,
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
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm border-zinc-800 bg-card/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-5">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials below to create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
