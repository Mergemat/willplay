"use client";
import { useQuery } from "convex/react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/../convex/_generated/api";
import { GameSearchInput } from "~/components/game-search-input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function DashboardPage() {
  const games = useQuery(api.games.getUserGames);

  if (!games) {
    return null;
  }

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col px-4 lg:px-0">
      <GameSearchInput />
      <div className="my-8 flex items-center justify-between">
        <h1 className="font-bold text-4xl">My Games</h1>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-played">Last Played</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="release-date">Release Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard game={game} key={game?.steamId} />
        ))}
      </div>
    </div>
  );
}

function GameCard({
  game,
}: {
  game: (typeof api.games.getUserGames._returnType)[number];
}) {
  if (!game) {
    return null;
  }
  return (
    <Card className="group overflow-hidden">
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
