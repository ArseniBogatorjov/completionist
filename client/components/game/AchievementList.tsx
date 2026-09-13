import { Achievement } from '@/types/dashboard/achievement.types';
import AchievementCard from '@/components/game/AchievementCard';

interface AchievementListProps {
  achievements: Achievement[];
}

export default function AchievementList({
  achievements,
}: AchievementListProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.id}
          name={achievement.name}
          iconUrl={achievement.iconUrl}
          description={achievement.description}
          userAchievements={achievement.userAchievements}
          globalRarity={achievement.globalRarity}
          isMissable={achievement.isMissable}
        />
      ))}
    </div>
  );
}
