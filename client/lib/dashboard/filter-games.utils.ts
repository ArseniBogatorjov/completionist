import { GameFilterOptions } from '@/types/dashboard/dashboard.types';
import { LibraryGame } from '@/types/dashboard/game.types';

function filterGames(filter: GameFilterOptions, games: LibraryGame[]) {
  switch (filter) {
    case 'all':
      return games;
    case 'playing':
      return games.filter((game) => game.status === 'playing');
    case 'completed':
      return games.filter((game) => game.status === 'completed');
    case 'backlog':
      return games.filter((game) => game.status === 'backlog');
    default:
      return games;
  }
}

export function getDisplayedGames(
  games: LibraryGame[],
  filter: GameFilterOptions,
  search: string,
) {
  const filteredGames = filterGames(filter, games);

  const query = search.trim().toLowerCase();

  if (!query) return filteredGames;

  return filteredGames.filter((game) =>
    game.game.name.toLowerCase().includes(query),
  );
}
