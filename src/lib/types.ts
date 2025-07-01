import type { STATUSES } from "./constants";

export type GameStatus = (typeof STATUSES)[keyof typeof STATUSES];
export type Priority = "high" | "medium" | "low";
