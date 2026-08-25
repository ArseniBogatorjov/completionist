import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gamepad2, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { MobileNav } from '@/components/navigation/MobileNav';

export default function Header() {
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
            Completionist
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 transition-all duration-300 hover:text-teal-400"
          >
            Main
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-400 transition-all duration-300 hover:text-teal-400"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="ml-4 flex items-center gap-3 border-l border-white/10 pl-6">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-300 hover:text-teal-400"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button
                size="sm"
                className="border border-teal-400/50 bg-teal-400/10 text-teal-400 transition-all duration-300 hover:bg-teal-400 hover:text-black hover:shadow-[0_0_15px_rgba(102,252,241,0.4)]"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
          </div>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
