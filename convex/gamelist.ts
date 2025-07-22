import { ConvexError, v } from "convex/values";
import { PRIORITY_SORT_ORDER } from "~/lib/constants";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import schema from "./schema";

export const getUserGameList = query({
  args: {
    userId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { userId }) => {
    // const identity = await ctx.auth.getUserIdentity();
    //
    // if (identity === null) {
    //   throw new ConvexError("Not authenticated");
    // }

    const allGameLists = await ctx.db
      .query("gamelist")
      .withIndex("by_user", (q) => q.eq("userId", userId ?? ""))
      .collect();

    allGameLists.sort(
      (a, b) =>
        PRIORITY_SORT_ORDER.indexOf(a.priority) -
        PRIORITY_SORT_ORDER.indexOf(b.priority)
    );

    const foundGames =
      (await Promise.all(
        (allGameLists ?? []).map((game) => ctx.db.get(game.gameId))
      )) ?? [];

    const gamelistsWithGames = allGameLists
      ? allGameLists.map((list) => ({
          ...list,
          // biome-ignore lint/style/noNonNullAssertion: <>
          game: foundGames.find((game) => game?._id === list.gameId)!,
        }))
      : [];

    const wishlistGames = gamelistsWithGames.filter(
      (game) => game.status === "wishlist"
    );
    const backlogGames = gamelistsWithGames.filter(
      (game) => game.status === "backlog"
    );
    const playingGames = gamelistsWithGames.filter(
      (game) => game.status === "playing"
    );
    const completedGames = gamelistsWithGames.filter(
      (game) => game.status === "completed"
    );

    return {
      wishlist: wishlistGames,
      backlog: backlogGames,
      playing: playingGames,
      completed: completedGames,
    };
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

export const removeGameFromList = mutation({
  args: {
    gameId: v.id("gamelist"),
  },
  handler: async (ctx, { gameId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Not authenticated");
    }

    return await ctx.db.delete(gameId);
  },
});
