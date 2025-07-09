import { useAction, useQuery } from "convex/react";
import { Loader2, Search, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "~/../convex/_generated/api";
import type { Doc } from "~/../convex/_generated/dataModel";
import { useDebounce } from "~/hooks/use-debounce";
import { cn, shimmer, toBase64 } from "~/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const gameApiLinkRegex = /\/app\/(\d+)/;

export function GameInput({
  onGameSelect,
}: {
  onGameSelect: (game: Partial<Doc<"games">>) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mode, setMode] = useState<"search" | "link">("search");

  const debouncedInputValue = useDebounce(inputValue, 200);

  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (debouncedInputValue) {
      setIsLoading(false);
    }
  }, [debouncedInputValue]);

  const handleGameSelect = useCallback(
    (game: Partial<Doc<"games">>) => {
      onGameSelect(game);
      setInputValue("");
      setShowSearchResults(false);
    },
    [onGameSelect]
  );

  const gameIdFromSteamLink = useMemo(() => {
    const match = inputValue?.match(gameApiLinkRegex);
    return match ? Number(match[1] ?? "") : null;
  }, [inputValue]);

  useEffect(() => {
    if (gameIdFromSteamLink) {
      setMode("link");
    }
  }, [gameIdFromSteamLink]);

  return (
    <div className="relative">
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        autoFocus={false}
        className="pl-9"
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsLoading(true);
          setShowSearchResults(true);
        }}
        placeholder={
          mode === "search"
            ? "Search for a game..."
            : "https://store.steampowered.com/app/3527290/PEAK"
        }
        value={inputValue}
      />
      <Button
        className={cn("absolute top-1 right-1 size-7", !inputValue && "hidden")}
        onClick={() => setInputValue("")}
        size="icon"
        type="button"
        variant="ghost"
      >
        <X className="h-4 w-4" />
      </Button>

      {showSearchResults ? (
        <>
          {mode === "search" && (
            <SearchResults
              isLoading={isLoading}
              onGameSelect={handleGameSelect}
              query={debouncedInputValue}
            />
          )}
          {mode === "link" && (
            <LinkResults onGameSelect={handleGameSelect} query={inputValue} />
          )}
        </>
      ) : null}
      <p className="text-muted-foreground text-sm">
        Can't find the game? Try{" "}
        <Button
          className="px-0"
          onClick={() =>
            setMode((prevMode) => (prevMode === "link" ? "search" : "link"))
          }
          type="button"
          variant="link"
        >
          {mode === "link" ? "search" : "link"}
        </Button>
      </p>
    </div>
  );
}

function SearchResults({
  query,
  onGameSelect,
  isLoading,
}: {
  query?: string;
  onGameSelect: (game: Partial<Doc<"games">>) => void;
  isLoading: boolean;
}) {
  const searchResults = useQuery(api.games.findGameByName, {
    name: query ?? "",
  });

  const isPending = searchResults === undefined;

  return (
    <div className="relative">
      {query && (
        <GameSelect
          games={searchResults}
          handleSelectGame={(game: Partial<Doc<"games">>) => onGameSelect(game)}
          isLoading={isLoading || isPending}
        />
      )}
    </div>
  );
}

function LinkResults({
  query,
  onGameSelect,
}: {
  query?: string;
  onGameSelect: (game: Partial<Doc<"games">>) => void;
}) {
  const [game, setGame] = useState<Partial<Doc<"games">>>();
  const [isPending, setIsPending] = useState(false);
  const fetchGameByLink = useAction(api.games.getGameDetails);

  const gameIdFromSteamLink = useMemo(() => {
    const match = query?.match(gameApiLinkRegex);
    return match ? Number(match[1] ?? "") : null;
  }, [query]);

  useEffect(() => {
    if (gameIdFromSteamLink) {
      setIsPending(true);
      fetchGameByLink({ gameId: gameIdFromSteamLink }).then((result) => {
        if (!result.success) {
          setGame(undefined);
          setIsPending(false);
          toast.error(result.error);
          return;
        }
        setGame(result.data);
        setIsPending(false);
      });
    }
  }, [gameIdFromSteamLink, fetchGameByLink]);

  useEffect(() => {
    if (gameIdFromSteamLink === null && game) {
      setGame(undefined);
      return;
    }
  }, [gameIdFromSteamLink, game]);

  return (
    <div className="relative">
      {game && (
        <GameSelect
          games={[game]}
          handleSelectGame={(selectedGame: Partial<Doc<"games">>) => {
            onGameSelect(selectedGame);
            setGame(undefined);
          }}
          isLoading={isPending}
        />
      )}
    </div>
  );
}

function GameSelect({
  games,
  isLoading,
  handleSelectGame,
}: {
  games?: Partial<Doc<"games">>[] | null;
  isLoading: boolean;
  handleSelectGame: (game: Partial<Doc<"games">>) => void;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, borderWidth: "1px" }}
      className="absolute z-10 w-full rounded-md border border-input bg-popover shadow-md"
      exit={{ opacity: 0, borderWidth: "0px" }}
      initial={{ opacity: 0, borderWidth: "0px" }}
      layout
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 500,
        duration: 0.1,
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        // biome-ignore lint/style/noNestedTernary: <>
      ) : (games?.length ?? 0) > 0 ? (
        <div className="max-h-60 overflow-y-auto overflow-x-hidden p-1">
          {games?.map((game) => (
            <Button
              asChild
              className="h-fit w-fit border-muted border-b"
              key={game._id}
              onClick={() => handleSelectGame(game)}
              variant="ghost"
            >
              <div className="w-full items-center gap-3 ">
                <Image
                  alt={game.name ?? ""}
                  className="h-12 w-20 rounded-sm object-cover"
                  height={100}
                  placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(100, 100))}`}
                  src={game.image ?? ""}
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
    </motion.div>
  );
}
