import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import schema from "./schema";
import type { SteamApiResponse } from "./types";

export const findGameByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const game = await ctx.db
      .query("games")
      .withSearchIndex("search_name", (q) => q.search("name", name))
      .take(3);

    if (!game) {
      return null;
    }

    return game;
  },
});

export const addGame = mutation({
  args: schema.tables.games.validator,
  handler: async (ctx, { name, description, image, steamId, genre }) => {
    const existingGame = await ctx.db
      .query("games")
      .withIndex("by_steam_id", (q) => q.eq("steamId", steamId))
      .first();

    if (existingGame) {
      return existingGame;
    }

    return await ctx.db.insert("games", {
      name,
      description,
      image,
      steamId,
      genre,
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

      return {
        success: true,
        data: {
          name: steamResponse.data.name,
          description: steamResponse.data.short_description,
          image: steamResponse.data.header_image,
          steamId: steamResponse.data.steam_appid,
          genre: steamResponse.data.genres[1]?.description,
        },
      } as const;
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
  args: {
    status: schema.tables.gamelist.validator.fields.status,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    const gameList = await ctx.db
      .query("gamelist")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    const games = await Promise.all(
      (gameList ?? []).map((game) => ctx.db.get(game.gameId))
    );

    return games ?? [];
  },
});
