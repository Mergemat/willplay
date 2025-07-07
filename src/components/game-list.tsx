"use client";
import { useUser } from "@clerk/nextjs";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { Share } from "lucide-react";
import { toast } from "sonner";
import type { api } from "~/../convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { STATUS_ICONS, STATUS_LABELS, STATUSES } from "~/lib/constants";
import type { GameStatus } from "~/lib/types";
import { AddGameModal } from "./add-game-modal";
import EmptyState from "./empty-state";
import { GameCard, GameCardSkeleton } from "./game-card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function GameList({
  preloadedGames,
  isPreview = false,
}: {
  preloadedGames: Preloaded<typeof api.gamelist.getUserGameList>;
  isPreview?: boolean;
}) {
  const session = useUser();
  const activeList =
    (localStorage.getItem("activeList") as GameStatus) || STATUSES.WISHLIST;

  const {
    wishlist: wishlistGames,
    playlist: playlistGames,
    done: doneGames,
  } = usePreloadedQuery(preloadedGames);

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
        <TabsList className="h-fit w-full justify-start overflow-x-scroll sm:w-fit sm:overflow-x-visible">
          {Object.values(STATUSES).map((status) => {
            const games = getGamesByStatus(status);
            const count = games.length;
            const Icon = STATUS_ICONS[status];

            return (
              <TabsTrigger
                className="box-border sm:px-4"
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
        <div className="flex w-full items-center justify-end gap-4">
          {isPreview ? null : <AddGameModal />}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  // add to clipboard
                  toast.promise(
                    navigator.clipboard.writeText(
                      `https://willplay.me/${session.user?.id}`
                    ),
                    {
                      loading: "Copying link...",
                      success: "Link copied to clipboard!",
                      error: "Failed to copy link to clipboard.",
                    }
                  );
                }}
                size="icon"
                variant="secondary"
              >
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </div>
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
              <GameGrid games={games} isPreview={isPreview} loading={loading} />
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
  isPreview,
}: {
  games: (typeof api.gamelist.getUserGameList._returnType)[GameStatus];
  loading: boolean;
  isPreview?: boolean;
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
        games.map((game) => (
          <GameCard gamelist={game} isPreview={isPreview} key={game._id} />
        ))
      )}
    </div>
  );
}
