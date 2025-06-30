"use client";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { on } from "events";
import { ExternalLink, Heart } from "lucide-react";
import Image from "next/image";
import { GameSearchInput } from "~/components/game-search-input";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col">
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
      {games.map((game) => (
        <GameCard game={game} key={game?.steamId} />
      ))}
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
    <Card className="group overflow-hidden transition-all duration-100 hover:border-primary/50">
      <div className="relative">
        <Image
          alt="edd"
          className="h-48 w-full object-cover"
          height={200}
          src={game?.image}
          width={300}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={getPriorityColor("high")} variant="outline">
            High
          </Badge>
        </div>
        <div className="absolute right-3 bottom-3 opacity-0 transition-opacity duration-100 group-hover:opacity-100">
          <Button size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3>{game.name}</h3>
          <Button size="sm" variant="ghost">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-3 line-clamp-2 text-slate-400 text-sm">
          {game.description}
        </p>
      </CardContent>
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
