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
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pt-6 pb-12 xl:px-0">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl tracking-tight md:text-4xl">
            My Game Collection
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your game collection and track what you want to play next.
          </p>
        </div>
        <Button className="w-full gap-2 sm:w-auto" size="default">
          <Plus className="h-4 w-4" />
          <span>Add Game</span>
        </Button>
      </header>
      <main className="flex-1 overflow-hidden">
        <GameList preloadedGames={preloadedGames} />
      </main>
    </div>
  );
}
