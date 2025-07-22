"use client";
import { useMutation } from "convex/react";
import { ExternalLink, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { toast } from "sonner";
import { api } from "~/../convex/_generated/api";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  GENRE_COLORS,
  PRIORITY_COLORS,
  PRIORITY_ICONS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from "~/lib/constants";
import type { GameStatus } from "~/lib/types";
import { cn, shimmer, toBase64 } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MoveToButton } from "./move-to-button";

export function GameCard({
  gamelist,
  isPreview,
}: {
  gamelist: (typeof api.gamelist.getUserGameList._returnType)[GameStatus][number];
  isPreview?: boolean;
}) {
  const changeGameStatus = useMutation(api.gamelist.changeGameStatus);

  const handleMoveTo = useCallback(
    (status: GameStatus) => {
      toast.promise(
        changeGameStatus({
          gameId: gamelist._id,
          status,
        }),
        {
          loading: `Moving to ${STATUS_LABELS[status]}`,
          success: `Moved to ${STATUS_LABELS[status]}`,
          error: `Failed to move to ${STATUS_LABELS[status]}`,
        }
      );
    },
    [gamelist, changeGameStatus]
  );

  const PriorityIcon = PRIORITY_ICONS[gamelist.priority];

  if (!gamelist) {
    return null;
  }

  return (
    <Card className="group hover:shadow-md">
      <div className="relative overflow-hidden">
        <Image
          alt={gamelist.game.name}
          className="h-48 w-full object-cover"
          height={200}
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(300, 200))}`}
          src={gamelist.game.image}
          width={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-4 transition-opacity duration-100 md:opacity-0 md:group-hover:opacity-100">
          <DeleteButton gamelist={gamelist} />
        </div>
      </div>
      <CardHeader className="flex space-y-2 p-4 py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <GameTitle
            steamId={gamelist.game.steamId}
            title={gamelist.game.name}
          />

          <Badge
            className={PRIORITY_COLORS[gamelist.priority]}
            variant="outline"
          >
            <PriorityIcon className="h-4 w-4" />
            {PRIORITY_LABELS[gamelist.priority]}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {gamelist.game.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-end p-4 pt-2">
        {isPreview ? null : (
          <MoveToButton
            changeGameStatus={handleMoveTo}
            currentStatus={gamelist.status as GameStatus}
          />
        )}
      </CardFooter>
    </Card>
  );
}

export function GameCardSkeleton() {
  return (
    <Card className="group overflow-hidden">
      <div className="relative">
        <div className="h-48 w-full animate-pulse bg-muted" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <CardHeader className="flex p-4 pb-2.5">
        <div className="flex w-full items-center gap-4">
          <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-1 h-3 w-full animate-pulse rounded bg-muted" />
        <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardFooter className="flex items-center justify-end gap-4 pt-2">
        <Button className="animate-pulse rounded bg-muted" disabled size="sm">
          Move to
        </Button>
      </CardFooter>
    </Card>
  );
}

function GameTitle({
  title,
  steamId,
}: {
  title: string;
  steamId: string | number;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          className="flex items-center gap-2 text-left hover:underline"
          href={`https://store.steampowered.com/app/${steamId}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <CardTitle className="line-clamp-1 w-fit break-all font-bold text-2xl">
            {title}
          </CardTitle>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>View on Steam</p>
      </TooltipContent>
    </Tooltip>
  );
}

function DeleteButton({
  gamelist,
}: {
  gamelist: (typeof api.gamelist.getUserGameList._returnType)[GameStatus][number];
}) {
  const removeGameFromList = useMutation(api.gamelist.removeGameFromList);

  const handleRemove = useCallback(() => {
    toast.promise(
      removeGameFromList({
        gameId: gamelist._id,
      }),
      {
        loading: "Removing from list",
        success: "Removed from list",
        error: "Failed to remove from list",
      }
    );
  }, [removeGameFromList, gamelist._id]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label="Remove from list"
          className="opacity-80 transition-opacity hover:opacity-100"
          onClick={handleRemove}
          size="icon"
          variant="destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Remove from list</p>
      </TooltipContent>
    </Tooltip>
  );
}
