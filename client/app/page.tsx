import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BarChart3,
  Gamepad2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col justify-between overflow-hidden pb-8 selection:bg-teal-500 selection:text-black">
      <section className="relative flex flex-1 flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,252,241,0.08)_0,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl px-4">
          <Badge
            variant="outline"
            className="mb-4 border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs text-teal-400"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Next-Gen Achievement
            Tracker
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-zinc-100">
            Master Every Game. <br />
            <span className="bg-linear-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Track 100% Completion.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Organize your gaming library, track achievement rarity, get missable
            warnings, and showcase your gaming legacy all in one place.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <Button
              size="lg"
              asChild
              className="bg-teal-400 font-semibold text-black hover:bg-teal-300"
            >
              <Link href="/register">
                Start Tracking Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full pt-6">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-white/10 bg-black/30 backdrop-blur-md hover:border-teal-400/40 transition-all">
              <CardHeader>
                <Gamepad2 className="h-8 w-8 text-teal-400 mb-2" />
                <CardTitle className="text-zinc-100">Library Sync</CardTitle>
                <CardDescription className="text-zinc-400">
                  Keep track of playtimes, overall progress, and completed
                  titles seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-white/10 bg-black/30 backdrop-blur-md hover:border-teal-400/40 transition-all">
              <CardHeader>
                <ShieldAlert className="h-8 w-8 text-amber-400 mb-2" />
                <CardTitle className="text-zinc-100">Missable Alerts</CardTitle>
                <CardDescription className="text-zinc-400">
                  Never miss a missable achievement again with clear visual
                  indicators during your playthrough.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-white/10 bg-black/30 backdrop-blur-md hover:border-teal-400/40 transition-all">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-teal-400 mb-2" />
                <CardTitle className="text-zinc-100">
                  Rarity Analytics
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Discover ultra-rare achievements and compare global unlock
                  statistics in real-time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
