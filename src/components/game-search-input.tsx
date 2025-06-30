"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation } from "convex/react";
import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/../convex/_generated/api";
import type { AppData } from "~/../convex/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  gameId: z.coerce.number(),
});

export function GameSearchInput() {
  const [game, setGame] = useState<AppData | null>(null);
  const getGameDetails = useAction(api.games.getGameDetails);
  const addGame = useMutation(api.games.addGame);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: 730,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const details = await getGameDetails({ gameId: data.gameId });

    if (!details.success) {
      toast.error(details.error);
      setGame(null);
      return;
    }

    if (details) {
      setGame(details.data);
      await addGame({
        name: details.data.name,
        description: details.data.short_description,
        image: details.data.header_image,
        steamAppId: details.data.steam_appid,
      });

      toast.success("Game details fetched!");
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex w-full max-w-sm items-center"
        onSubmit={handleSubmit}
      >
        <Input placeholder="Steam App ID" {...form.register("gameId")} />
        <Button className="ml-2" type="submit">
          <Search />
          Search
        </Button>
      </form>

      {game && (
        <Card>
          <CardHeader>
            <CardTitle>{game.name}</CardTitle>
            <CardDescription>{game.short_description}</CardDescription>
          </CardHeader>
          <CardContent>
            <img alt={game.name} src={game.header_image} />
          </CardContent>
          <CardFooter>
            <Button asChild>
              <a
                href={`https://store.steampowered.com/app/${game.steam_appid}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                View on Steam
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
