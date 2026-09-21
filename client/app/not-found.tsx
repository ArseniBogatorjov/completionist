import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Gamepad2, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center p-4 selection:bg-teal-500 selection:text-black">
      <div className="relative flex max-w-md w-full flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,252,241,0.12)_0,transparent_70%)] pointer-events-none" />

        <Card className="relative w-full border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-2xl">
          <CardContent className="flex flex-col items-center pt-6 space-y-6">
            <Badge
              variant="outline"
              className="border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs text-teal-400"
            >
              Error 404
            </Badge>

            <div className="relative flex items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full bg-teal-400/10 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/80 shadow-inner">
                <Gamepad2 className="h-10 w-10 text-teal-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
                Page Not Found
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The page or achievement you are looking for doesn&#39;t exist,
                has been removed, or is temporarily unavailable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
              <Button
                asChild
                className="w-full sm:w-auto bg-teal-400 font-semibold text-black hover:bg-teal-300"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full sm:w-auto border-white/10 bg-black/20 backdrop-blur-md text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
