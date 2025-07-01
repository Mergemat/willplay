import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    steamId: v.number(),
    name: v.string(),
    description: v.string(),
    image: v.string(),
    genre: v.optional(v.string()),
  })
    .index("by_steam_id", ["steamId"])
    .index("by_name", ["name"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  gamelist: defineTable({
    userId: v.string(),
    gameId: v.id("games"),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    status: v.union(
      v.literal("wishlist"),
      v.literal("playlist"),
      v.literal("done")
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_game", ["userId", "gameId"]),
});
