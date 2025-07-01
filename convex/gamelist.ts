import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
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

    const games = await Promise.all(
      (gameList ?? []).map((game) => ctx.db.get(game.gameId))
    );

    return games ?? [];
  },
});
