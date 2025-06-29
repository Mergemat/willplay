import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import type { SteamApiResponse } from "./types";

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
