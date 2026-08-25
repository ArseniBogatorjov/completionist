import type { LibraryGame } from '@/types/dashboard/game.types';
import GameCard from '@/components/dashboard/GameCard';

interface GamesListProps {
  games: LibraryGame[];
}

export default function GamesList({ games }: GamesListProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold tracking-tight">Games library</h2>

      {games.length === 0 ? (
        <p className="text-zinc-500">No games to display</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
