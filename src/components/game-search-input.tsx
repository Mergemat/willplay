import { useAction, useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "~/../convex/_generated/api";
import type { Doc } from "~/../convex/_generated/dataModel";
import { useDebounce } from "~/hooks/use-debounce";
import { shimmer, toBase64 } from "~/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function GameInput({
  onGameSelect,
}: {
  onGameSelect: (game: Partial<Doc<"games">>) => void;
}) {
  const [mode, setMode] = useState<"search" | "link">("search");
  return mode === "search" ? (
    <GameSearchInput onGameSelect={onGameSelect} setMode={setMode} />
  ) : (
    <GameLinkInput onGameSelect={onGameSelect} setMode={setMode} />
  );
}

function GameSearchInput({
  onGameSelect,
  setMode,
}: {
  onGameSelect: (game: Partial<Doc<"games">>) => void;
  setMode: (mode: "search" | "link") => void;
}) {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

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
      <p className="text-muted-foreground text-sm">
        Can't find the game? Try adding it{" "}
        <Button
          className="px-0"
          onClick={() => setMode("link")}
          type="button"
          variant="link"
        >
          with a link
        </Button>
        .
      </p>

      {debouncedSearchQuery && showSearchResults && (
        <div className="absolute top-10 z-10 w-full rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            // biome-ignore lint/style/noNestedTernary: <>
          ) : (searchResults?.length ?? 0) > 0 ? (
            <div className="max-h-60 overflow-y-auto p-1">
              {searchResults?.map((game) => (
                <Button
                  asChild
                  className="h-fit w-fit border-muted border-b"
                  key={game._id}
                  onClick={() => handleSelectGame(game)}
                  variant="ghost"
                >
                  <div className="w-full items-center gap-3 ">
                    <Image
                      alt={game.name}
                      className="h-12 w-20 rounded-sm object-cover"
                      height={100}
                      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(100, 100))}`}
                      src={game.image}
                      width={100}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h2 className="truncate font-medium text-base">
                        {game.name}
                      </h2>
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

const gameApiLinkRegex = /\/app\/(\d+)\//;
function GameLinkInput({
  onGameSelect,
  setMode,
}: {
  onGameSelect: (game: Partial<Doc<"games">>) => void;
  setMode: (mode: "search" | "link") => void;
}) {
  const [link, setLink] = useState("");
  const [game, setGame] = useState<Partial<Doc<"games">>>();
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const debouncedSearchQuery = useDebounce(getGameIdFromSteamLink(link), 300);

  const fetchGameByLink = useAction(api.games.getGameDetails);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true);
      fetchGameByLink({ gameId: debouncedSearchQuery }).then((result) => {
        if (!result.success) {
          setGame(undefined);
          setIsLoading(false);
          toast.error(result.error);
          return;
        }
        setGame(result.data);
        setIsLoading(false);
      });
    }
  }, [debouncedSearchQuery, fetchGameByLink]);

  function getGameIdFromSteamLink(url: string) {
    const match = url.match(gameApiLinkRegex);
    return match ? Number(match[1] ?? "") : null;
  }

  return (
    <div className="relative">
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9"
        onChange={(e) => {
          setShowSearchResults(true);
          setLink(e.target.value);
        }}
        placeholder="https://store.steampowered.com/app/3527290/PEAK"
        value={link}
      />
      <p className="text-muted-foreground text-sm">
        Can't find the game? Try adding it{" "}
        <Button
          className="px-0"
          onClick={() => setMode("search")}
          type="button"
          variant="link"
        >
          with a search
        </Button>
        .
      </p>
      {game && debouncedSearchQuery && showSearchResults && (
        <div className="absolute top-10 z-10 w-full rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            // biome-ignore lint/style/noNestedTernary: <>
          ) : (setGame?.length ?? 0) > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              <Button
                asChild
                className="h-fit w-fit"
                key={game.name}
                onClick={() => {
                  onGameSelect(game);
                  setLink("");
                  setShowSearchResults(false);
                }}
                variant="ghost"
              >
                <div className="flex w-full cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-muted/50">
                  <Image
                    alt={game.name ?? ""}
                    className="h-12 w-20 rounded-sm object-cover"
                    height={100}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(100, 100))}`}
                    src={game.image ?? ""}
                    width={100}
                  />
                  <div className="flex-1 overflow-hidden">
                    <h4 className="truncate font-medium">{game.name}</h4>
                    <p className="truncate text-muted-foreground text-sm">
                      {game.genre}
                    </p>
                  </div>
                </div>
              </Button>
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
