import { FilterOptions } from '@/types/dashboard/dashboard.types';
import { LibraryGame } from '@/types/dashboard/game.types';

export function filterGames(filter: FilterOptions, games: LibraryGame[]) {
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
