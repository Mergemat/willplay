"use client";
import { type Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "~/../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import EmptyState from "./empty-state";
import { GameCard, GameCardSkeleton } from "./game-card";

type GameStatus = "want_to_buy" | "in_library" | "played";

const statusLabels: Record<GameStatus, string> = {
  want_to_buy: "Want to Buy",
  in_library: "Want to Play",
  played: "Played",
};

export default function GameList({
  preloadedGames,
}: {
  preloadedGames: Preloaded<typeof api.games.getUserGames>;
}) {
  const wantToBuyGames = usePreloadedQuery(preloadedGames);
  const inLibraryGames = useQuery(api.games.getUserGames, {
    status: "in_library",
  });
  const playedGames = useQuery(api.games.getUserGames, { status: "played" });

  const getGamesByStatus = (status: GameStatus) => {
    switch (status) {
      case "want_to_buy":
        return wantToBuyGames || [];
      case "in_library":
        return inLibraryGames || [];
      case "played":
        return playedGames || [];
      default:
        return [];
    }
  };

  const isLoading = (status: GameStatus) => {
    switch (status) {
      case "want_to_buy":
        return !wantToBuyGames;
      case "in_library":
        return inLibraryGames === undefined;
      case "played":
        return playedGames === undefined;
      default:
        return false;
    }
  };

  return (
    <Tabs defaultValue="want_to_buy">
      <TabsList className="mb-4">
        {Object.entries(statusLabels).map(([status, label]) => {
          const statusTyped = status as GameStatus;
          const games = getGamesByStatus(statusTyped);
          const count = games.length;

          return (
            <TabsTrigger key={status} value={status}>
              {label}
              {count > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 font-medium text-primary text-xs">
                  {count}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {Object.keys(statusLabels).map((status) => {
        const statusTyped = status as GameStatus;
        const loading = isLoading(statusTyped);
        const games = getGamesByStatus(statusTyped);
        const isEmpty = !loading && games.length === 0;

        return (
          <TabsContent
            className="fade-in-50 animate-in transition-all duration-300"
            key={status}
            value={status}
          >
            {isEmpty ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  // Display skeletons while loading
                  <>
                    <GameCardSkeleton />
                    <GameCardSkeleton />
                    <GameCardSkeleton />
                  </>
                ) : (
                  // Display actual games when loaded
                  games.map((game) => (
                    <GameCard game={game} key={game?.steamId} />
                  ))
                )}
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
