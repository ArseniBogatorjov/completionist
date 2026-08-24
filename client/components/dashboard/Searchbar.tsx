import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

interface SearchbarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

//TODO: deal with rerender on each key press

export default function Searchbar({ search, setSearch }: SearchbarProps) {
  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      type="search"
      placeholder="Search for game..."
      className="bg-black/20 text-zinc-100 transition-all duration-300 hover:border-teal-400/50"
    />
  );
}
