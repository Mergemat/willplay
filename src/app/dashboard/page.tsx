import { preloadQuery } from "convex/nextjs";
import { Suspense } from "react";
import { api } from "~/../convex/_generated/api";
import { getAuthToken } from "~/lib/auth";
import { STATUSES } from "~/lib/constants";
import GameList from "./_components/game-list";

export default async function DashboardPage() {
  const token = await getAuthToken();
  const preloadedGames = await preloadQuery(
    api.games.getUserGames,
    {
      status: STATUSES.WISHLIST,
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
      </header>
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <GameList preloadedGames={preloadedGames} />
        </Suspense>
      </main>
    </div>
  );
}
