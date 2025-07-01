import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
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

export const findGameBySteamId = query({
  args: {
    steamId: v.number(),
  },
  handler: async (ctx, { steamId }) => {
    const game = await ctx.db
      .query("games")
      .withIndex("by_steam_id", (q) => q.eq("steamId", steamId))
      .first();

    console.log(game);

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
  handler: async (
    ctx,
    { gameId }
  ): Promise<
    | {
        success: true;
        data: {
          _id?: Id<"games">;
          _creationTime?: number;
          genre?: string | undefined;
          steamId: number;
          name: string;
          description: string;
          image: string;
        };
      }
    | { success: false; error: string }
  > => {
    try {
      const existingGame = await ctx.runQuery(api.games.findGameBySteamId, {
        steamId: gameId,
      });

      if (existingGame) {
        return {
          success: true,
          data: existingGame,
        } as const;
      }

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
          genre: steamResponse.data.genres[0]?.description,
        },
      } as const;
    } catch (error) {
      const message =
        error instanceof ConvexError || error instanceof Error
          ? error.message
          : "Unknown error";
      return {
        success: false,
        error: message,
      } as const;
    }
  },
});
