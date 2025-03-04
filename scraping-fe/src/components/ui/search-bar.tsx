import React from 'react';
import { Button, Input } from '@/components/ui';
import { Search } from 'lucide-react';

interface SearchBarProps {
  txtSearch: string;
  setTxtSearch: (value: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  txtSearch,
  setTxtSearch,
  handleSearch,
}) => {
  return (
    <div className="relative mb-2 flex gap-2">
      <i className="absolute top-[6px] left-2">
        <Search size={15} />
      </i>
      <Input
        placeholder="Search..."
        className="p-3 pl-6 w-[300px] h-7"
        value={txtSearch}
        onChange={(e) => setTxtSearch(e.target.value)}
      />
      <Button
        size="sm"
        variant="outline"
        className="float-right flex items-center gap-1 rounded-md h-7"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );
};

export { SearchBar };
