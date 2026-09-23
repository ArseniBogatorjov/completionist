'use client';

import Link from 'next/link';
import { Gamepad2, LayoutDashboard } from 'lucide-react';
import { MobileNav } from '@/components/navigation/MobileNav';
import { UserNav } from '@/components/navigation/UserNav';
import { useAuth } from '@/providers/AuthProvider';

export default function Header() {
  const { user, isLoading } = useAuth();

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 shadow-lg transition-colors group-hover:bg-teal-400/20 group-hover:shadow-[0_0_15px_rgba(102,252,241,0.2)]">
            <Gamepad2 className="h-6 w-6 text-zinc-100 transition-colors group-hover:text-teal-400" />
          </div>

          <span className="text-lg font-bold tracking-wider text-zinc-100 transition-colors group-hover:text-teal-400">
            Completionist Hub
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition-colors hover:text-teal-400"
          >
            Main
          </Link>

          {!isLoading && isAuthenticated && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-teal-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}

          <div className="ml-2 border-l border-white/10 pl-6">
            <UserNav />
          </div>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
