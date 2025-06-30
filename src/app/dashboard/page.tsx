import { preloadQuery } from "convex/nextjs";
import { Plus } from "lucide-react";
import { api } from "~/../convex/_generated/api";
import { Button } from "~/components/ui/button";
import { getAuthToken } from "~/lib/auth";
import GameList from "./_components/game-list";

export default async function DashboardPage() {
  const token = await getAuthToken();
  const preloadedGames = await preloadQuery(
    api.games.getUserGames,
    {
      status: "want_to_buy",
    },
    {
      token,
    }
  );

  return (
    <div className="mx-auto flex h-screen w-full max-w-7xl flex-col px-4 xl:px-0">
      <div className="my-8 flex items-center justify-between">
        <h1 className="font-bold text-4xl">My Games</h1>
        <Button size="icon" title="Add Game" variant="outline">
          <Plus />
        </Button>
      </div>
      <GameList preloadedGames={preloadedGames} />
    </div>
  );
}
