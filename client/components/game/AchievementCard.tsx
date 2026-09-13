import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/types/dashboard/achievement.types';

type AchievementCardProps = Omit<Achievement, 'id'>;

export default function AchievementCard({
  name,
  iconUrl,
  description,
  globalRarity,
  isMissable,
  userAchievements,
}: AchievementCardProps) {
  const isUnlocked = userAchievements && userAchievements.length > 0;

  const unlockedDate = isUnlocked
    ? new Date(userAchievements[0].unlockedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Card
      className={`group flex flex-row items-center gap-5 p-5 border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-[0_0_25px_rgba(102,252,241,0.15)] ${
        !isUnlocked ? 'opacity-60 hover:opacity-90' : ''
      }`}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 shadow-lg">
        <Image
          src={iconUrl}
          alt={name}
          fill
          sizes="80px"
          className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
            !isUnlocked ? 'grayscale filter' : ''
          }`}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center space-y-1.5 min-w-0">
        <div className="flex items-center gap-2.5">
          <h3
            className={`text-base font-bold truncate transition-colors ${
              isUnlocked
                ? 'text-zinc-100 group-hover:text-teal-400'
                : 'text-zinc-300'
            }`}
          >
            {name}
          </h3>

          {isMissable && (
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs px-2 py-0.5 font-medium"
            >
              Missable
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end justify-center space-y-2 pl-4 text-right">
        {globalRarity !== null && (
          <Badge
            variant="outline"
            className="bg-teal-400/10 text-teal-400 border-teal-400/20 text-xs px-2.5 py-1 font-semibold"
          >
            Rarity {globalRarity.toFixed(1)}%
          </Badge>
        )}

        <span className="text-xs text-zinc-400 font-medium">
          {isUnlocked ? `Unlocked ${unlockedDate}` : 'Locked'}
        </span>
      </div>
    </Card>
  );
}
