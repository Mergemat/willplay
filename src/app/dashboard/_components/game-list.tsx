"use client";
import { type Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "~/../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { STATUS_ICONS, STATUS_LABELS, STATUSES } from "~/lib/constants";
import type { GameStatus } from "~/lib/types";
import { AddGameModal } from "./add-game-modal";
import EmptyState from "./empty-state";
import { GameCard, GameCardSkeleton } from "./game-card";

export default function GameList({
  preloadedGames,
}: {
  preloadedGames: Preloaded<typeof api.gamelist.getUserGames>;
}) {
  const activeList =
    (localStorage.getItem("activeList") as GameStatus) || STATUSES.WISHLIST;

  const wishlistGames = usePreloadedQuery(preloadedGames);
  const playlistGames = useQuery(api.gamelist.getUserGames, {
    status: STATUSES.PLAYLIST,
  });
  const doneGames = useQuery(api.gamelist.getUserGames, {
    status: STATUSES.DONE,
  });

  const getGamesByStatus = (status: GameStatus) => {
    switch (status) {
      case STATUSES.WISHLIST:
        return wishlistGames || [];
      case STATUSES.PLAYLIST:
        return playlistGames || [];
      case STATUSES.DONE:
        return doneGames || [];
      default:
        return [];
    }
  };

  const isLoading = (status: GameStatus) => {
    switch (status) {
      case STATUSES.WISHLIST:
        return !wishlistGames;
      case STATUSES.PLAYLIST:
        return playlistGames === undefined;
      case STATUSES.DONE:
        return doneGames === undefined;
      default:
        return false;
    }
  };

  return (
    <Tabs defaultValue={activeList}>
      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <TabsList className="w-full sm:w-auto">
          {Object.values(STATUSES).map((status) => {
            const games = getGamesByStatus(status);
            const count = games.length;
            const Icon = STATUS_ICONS[status];

            return (
              <TabsTrigger
                className="sm:px-4"
                key={status}
                onClick={() => {
                  localStorage.setItem("activeList", status);
                }}
                value={status}
              >
                <Icon className="mr-2 h-4 w-4" />
                {STATUS_LABELS[status]}
                {count > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 font-medium text-primary text-xs">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <AddGameModal />
      </div>

      {Object.values(STATUSES).map((status) => {
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
              <GameGrid games={games} loading={loading} />
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

function GameGrid({
  games,
  loading,
}: {
  games: typeof api.gamelist.getUserGames._returnType;
  loading: boolean;
}) {
  return (
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
        games.map((game) => <GameCard gamelist={game} key={game._id} />)
      )}
    </div>
  );
}
