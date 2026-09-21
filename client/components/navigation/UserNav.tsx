'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
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
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-zinc-300 hover:bg-white/5 hover:text-teal-400"
        >
          <User className="h-4 w-4 text-teal-400" />
          <span className="text-sm font-medium">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 border-white/10 bg-zinc-950/90 backdrop-blur-md text-zinc-100"
      >
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer text-rose-400 focus:bg-rose-500/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
