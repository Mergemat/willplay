"use client";
import { useMutation } from "convex/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
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
import { PRIORITY_COLORS, PRIORITY_ICONS } from "~/lib/constants";
import type { GameStatus } from "~/lib/types";
import { shimmer, toBase64 } from "~/lib/utils";
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
      changeGameStatus({
        gameId: gamelist._id,
        status,
      });
    },
    [gamelist, changeGameStatus]
  );

  const PriorityIcon = PRIORITY_ICONS[gamelist.priority];

  if (!gamelist) {
    return null;
  }

  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <div className="relative overflow-hidden">
        <Image
          alt={gamelist.game.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          height={200}
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(300, 200))}`}
          src={gamelist.game.image}
          width={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            asChild
            className="opacity-80 transition-opacity hover:opacity-100"
            size="icon"
            title="View on Steam"
            variant="secondary"
          >
            <Link
              href={`https://store.steampowered.com/app/${gamelist.game.steamId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Badge
            className={PRIORITY_COLORS[gamelist.priority]}
            variant="outline"
          >
            <PriorityIcon className="h-4 w-4" />
            {gamelist.priority}
          </Badge>
        </div>
      </div>
      <CardHeader className="flex p-4 py-4">
        <div className="flex w-full items-center justify-between gap-4">
          <CardTitle className="line-clamp-1 font-bold text-2xl">
            {gamelist.game.name}
          </CardTitle>
          {gamelist.game.genre && (
            <Badge className="shrink-0" variant="secondary">
              {gamelist.game.genre}
            </Badge>
          )}
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
