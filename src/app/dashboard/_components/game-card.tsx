import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { api } from "~/../convex/_generated/api";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function GameCard({
  game,
}: {
  game: (typeof api.games.getUserGames._returnType)[number];
}) {
  if (!game) {
    return null;
  }
  return (
    <Card className="group">
      <div className="relative">
        <Image
          alt="edd"
          className="h-48 w-full object-cover"
          height={200}
          src={game?.image}
          width={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent " />
        <div className="absolute top-1 right-1 flex gap-2">
          <Button asChild size="icon" title="View on Steam" variant="secondary">
            <Link
              href={`https://store.steampowered.com/app/${game.steamId}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Badge className={getPriorityColor("high")} variant="outline">
            High
          </Badge>
        </div>
      </div>
      <CardHeader className="flex p-4 py-4">
        <div className="flex w-full items-center gap-4">
          <CardTitle className="line-clamp-1 font-bold text-2xl">
            {game.name}
          </CardTitle>
          <Badge variant="secondary">{game.genre}</Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {game.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-end gap-4">
        <Button>Add to</Button>
      </CardFooter>
    </Card>
  );
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export function GameCardSkeleton() {
  return (
    <Card className="group overflow-hidden">
      <div className="relative">
        <div className="h-48 w-full animate-pulse bg-muted" />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <CardHeader className="flex p-4 py-4">
        <div className="flex w-full items-center gap-4">
          <div className="h-7 w-3/4 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-1 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-0 h-4 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardFooter className="flex items-center justify-end gap-4">
        <div className="h-10 w-20 animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  );
}
