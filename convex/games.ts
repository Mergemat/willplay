import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import type { SteamApiResponse } from "./types";

export const addGame = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    image: v.string(),
    steamAppId: v.number(),
  },
  handler: async (ctx, { name, description, image, steamAppId }) => {
    const existingGame = await ctx.db
      .query("games")
      .withIndex("by_steam_id", (q) => q.eq("steamId", steamAppId))
      .first();

    if (existingGame) {
      return existingGame;
    }

    return await ctx.db.insert("games", {
      name,
      description,
      image,
      steamId: steamAppId,
    });
  },
});

export const getGameDetails = action({
  args: {
    gameId: v.number(),
  },
  handler: async (_, { gameId }) => {
    try {
      const response = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${gameId}`
      );

      if (!response.ok) {
        throw new ConvexError("Failed to fetch data");
      }

      const json = (await response.json()) as {
        [gameId]: SteamApiResponse;
      };
      const steamResponse = json[gameId];

      if (!steamResponse?.success) {
        return {
          success: false,
          error: "Game not found or data unavailable",
        } as const;
      }

      return { success: true, data: steamResponse.data } as const;
    } catch (error) {
      const message =
        error instanceof ConvexError || error instanceof Error
          ? error.message
          : "Unknown error";
      return {
        success: false,
        message,
      } as const;
    }
  },
});

export const getUserGames = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const gameList = await ctx.db
      .query("gamelist")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    const games = await Promise.all(
      (gameList ?? []).map((game) => ctx.db.get(game.gameId))
    );

    return games ?? [];
  },
});
