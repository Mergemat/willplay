import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import schema from "./schema";

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

    const games =
      (await Promise.all(
        (gameList ?? []).map((game) => ctx.db.get(game.gameId))
      )) ?? [];

    return gameList
      ? gameList.map((list) => ({
          ...list,
          // biome-ignore lint/style/noNonNullAssertion: <>
          game: games.find((game) => game?._id === list.gameId)!,
        }))
      : [];
  },
});

export const addGameToList = mutation({
  args: {
    game: v.object({
      id: v.optional(v.id("games")),
      steamId: v.number(),
      name: v.string(),
      description: v.string(),
      image: v.string(),
      genre: v.string(),
    }),
    status: schema.tables.gamelist.validator.fields.status,
    priority: schema.tables.gamelist.validator.fields.priority,
  },
  handler: async (ctx, { game, status, priority }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    let gameId = game.id;

    if (gameId) {
      const existingGame = await ctx.db
        .query("gamelist")
        .withIndex("by_user_and_game", (q) =>
          q.eq("userId", identity.subject).eq("gameId", gameId as Id<"games">)
        )
        .first();

      if (existingGame) {
        return await ctx.db.patch(existingGame?._id, {
          status,
          priority,
        });
      }
    }

    if (!gameId) {
      gameId = await ctx.db.insert("games", {
        name: game.name,
        description: game.description,
        image: game.image,
        steamId: game.steamId,
        genre: game.genre,
      });
    }

    return await ctx.db.insert("gamelist", {
      userId: identity.subject,
      gameId,
      status,
      priority,
    });
  },
});

export const changeGameStatus = mutation({
  args: {
    gameId: v.id("gamelist"),
    status: schema.tables.gamelist.validator.fields.status,
  },
  handler: async (ctx, { gameId, status }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.db.patch(gameId, {
      status,
    });
  },
});
