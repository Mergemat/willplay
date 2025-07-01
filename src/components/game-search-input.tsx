import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { api } from "~/../convex/_generated/api";
import type { Doc } from "~/../convex/_generated/dataModel";
import { useDebounce } from "~/hooks/use-debounce";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface GameSearchInputProps {
  onGameSelect: (game: Doc<"games">) => void;
}

export function GameSearchInput({ onGameSelect }: GameSearchInputProps) {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const searchResults = useQuery(api.games.findGameByName, {
    name: debouncedSearchQuery,
  });

  const isLoading = searchResults === undefined;

  const handleSelectGame = (game: Doc<"games">) => {
    onGameSelect(game);
    setSearchQuery(game.name); // Populate input with selected game name
    setShowSearchResults(false);
  };

  return (
    <div className="relative">
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSearchResults(true);
        }}
        placeholder="Search for a game..."
        value={searchQuery}
      />

      {debouncedSearchQuery && showSearchResults && (
        <div className="absolute top-full z-10 mt-2 w-full rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            // biome-ignore lint/style/noNestedTernary: <>
          ) : (searchResults?.length ?? 0) > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {searchResults?.map((game) => (
                <Button
                  asChild
                  className="h-fit w-fit"
                  key={game._id}
                  onClick={() => handleSelectGame(game)}
                  variant="ghost"
                >
                  <div className="flex w-full cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-muted/50">
                    <img
                      alt={game.name}
                      className="h-12 w-20 rounded-sm object-cover"
                      src={game.image}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="truncate font-medium">{game.name}</h4>
                      <p className="truncate text-muted-foreground text-sm">
                        {game.genre}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="p-4 text-center text-muted-foreground text-sm">
              No results found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
