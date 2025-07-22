import {
  CheckCircle,
  ChevronsDown,
  ChevronsUp,
  Gamepad2,
  Heart,
  ListTodo,
  Minus,
} from "lucide-react";

export const STATUSES = {
  WISHLIST: "wishlist",
  BACKLOG: "backlog",
  PLAYING: "playing",
  COMPLETED: "completed",
} as const;

export const STATUS_LABELS = {
  [STATUSES.WISHLIST]: "Wishlist",
  [STATUSES.BACKLOG]: "Backlog",
  [STATUSES.PLAYING]: "Playing",
  [STATUSES.COMPLETED]: "Completed",
} as const;

export const STATUS_ICONS = {
  [STATUSES.WISHLIST]: Heart,
  [STATUSES.BACKLOG]: ListTodo,
  [STATUSES.PLAYING]: Gamepad2,
  [STATUSES.COMPLETED]: CheckCircle,
} as const;

export const PRIORITIES = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export const PRIORITY_LABELS = {
  [PRIORITIES.HIGH]: "High",
  [PRIORITIES.MEDIUM]: "Medium",
  [PRIORITIES.LOW]: "Low",
} as const;

export const PRIORITY_ICONS = {
  [PRIORITIES.HIGH]: ChevronsUp,
  [PRIORITIES.MEDIUM]: Minus,
  [PRIORITIES.LOW]: ChevronsDown,
} as const;

export const PRIORITY_COLORS = {
  [PRIORITIES.HIGH]: "bg-red-500/20 text-red-400 border-red-500/30",
  [PRIORITIES.MEDIUM]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [PRIORITIES.LOW]: "bg-green-500/20 text-green-400 border-green-500/30",
} as const;

export const PRIORITY_SORT_ORDER = [
  PRIORITIES.HIGH,
  PRIORITIES.MEDIUM,
  PRIORITIES.LOW,
] as const;
