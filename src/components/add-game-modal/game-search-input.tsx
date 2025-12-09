import { useAction, useQuery } from "convex/react";
import { Loader2, Search, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { cn, shimmer, toBase64 } from "~/lib/utils";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const STEAM_LINK_REGEX =
  /(?:https?:\/\/)?(?:store\.steampowered\.com\/)?app\/(\d+)/i;

type Game = Partial<Doc<"games">>;

function extractSteamId(value?: string) {
  const match = value?.match(STEAM_LINK_REGEX);
  return match ? Number(match[1]) : null;
}

export function GameInput({
  onGameSelect,
}: {
  onGameSelect: (game: Game) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const deferredValue = useDeferredValue(inputValue);

  const steamGameId = useMemo(() => extractSteamId(inputValue), [inputValue]);

  const mode: "search" | "link" = steamGameId ? "link" : "search";
  const isLoading = inputValue !== deferredValue && deferredValue.length > 0;

  const handleSelect = useCallback(
    (game: Game) => {
      onGameSelect(game);
      setInputValue("");
    },
    [onGameSelect]
  );

  return (
    <div className="relative">
      <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />

      <Input
        className="pl-9"
        onChange={(e) => setInputValue(e.target.value)}
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

      {mode === "search" ? (
        <SearchResults
          isLoading={isLoading}
          onSelect={handleSelect}
          query={deferredValue}
        />
      ) : (
        <LinkResults onSelect={handleSelect} query={deferredValue} />
      )}

      <p className="text-muted-foreground text-sm">
        Can't find the game? Try{" "}
        <Button
          className="px-0"
          onClick={() => setInputValue("")}
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
  isLoading,
  onSelect,
}: {
  query?: string;
  isLoading: boolean;
  onSelect: (game: Game) => void;
}) {
  const results = useQuery(api.games.findGameByName, {
    name: query ?? "",
  });

  if (!query) {
    return null;
  }

  return (
    <GameSelect
      games={results}
      isLoading={isLoading || results === undefined}
      onSelect={onSelect}
    />
  );
}

function LinkResults({
  query,
  onSelect,
}: {
  query?: string;
  onSelect: (game: Game) => void;
}) {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchGame = useAction(api.games.getGameDetails);

  const steamId = useMemo(() => extractSteamId(query), [query]);

  useEffect(() => {
    let cancelled = false;

    if (!steamId) {
      setGame(null);
      return;
    }

    setIsLoading(true);
    fetchGame({ gameId: steamId }).then((res) => {
      if (cancelled) {
        return;
      }

      if (res.success) {
        setGame(res.data);
      } else {
        toast.error(res.error);
        setGame(null);
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [steamId, fetchGame]);

  if (!query) {
    return null;
  }

  return (
    <GameSelect
      games={game ? [game] : []}
      isLoading={isLoading}
      onSelect={onSelect}
    />
  );
}

function GameSelect({
  games,
  isLoading,
  onSelect,
}: {
  games?: Game[] | null;
  isLoading: boolean;
  onSelect: (game: Game) => void;
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
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : games && games.length > 0 ? (
        <div className="max-h-60 overflow-y-auto">
          {games.map((game) => (
            <Button
              className="w-full h-fit justify-start gap-3 border-muted border-b"
              key={game._id ?? game.name}
              onClick={() => onSelect(game)}
              variant="ghost"
            >
              <Image
                alt={game.name ?? ""}
                className="h-12 w-20 rounded-sm object-cover"
                height={100}
                placeholder={`data:image/svg+xml;base64,${toBase64(
                  shimmer(100, 100)
                )}`}
                src={game.image ?? ""}
                width={100}
              />
              <div className="overflow-hidden text-left">
                <p className="truncate font-medium">{game.name}</p>
                <p className="truncate text-muted-foreground text-sm">
                  {game.genre}
                </p>
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
