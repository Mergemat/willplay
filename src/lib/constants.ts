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

export const GENRES = {
  ACTION: "Action",
  FREE_TO_PLAY: "Free to Play",
  STRATEGY: "Strategy",
  ADVENTURE: "Adventure",
  INDIE: "Indie",
  RPG: "RPG",
  ANIMATION: "Animation & Modeling",
  VIDEO_PRODUCTION: "Video Production",
  CASUAL: "Casual",
  SIMULATION: "Simulation",
  RACING: "Racing",
  VIOLENT: "Violent",
  MASSIVELY_MULTIPLAYER: "Massively Multiplayer",
  NUDITY: "Nudity",
  SPORTS: "Sports",
  EARLY_ACCESS: "Early Access",
  GORE: "Gore",
  UTILITIES: "Utilities",
  EA: "Early Access",
  UTILITY: "Utilities",
  SEXUAL_CONTENT: "Sexual Content",
  GAME_DEVELOPMENT: "Game Development",
  ACCOUNTING: "Accounting",
  DOCUMENTARY: "Documentary",
  TUTORIAL: "Tutorial",
};

export const GENRE_COLORS = {
  [GENRES.ACTION]: "bg-red-500/20 text-red-400 border-red-500/30",
  [GENRES.FREE_TO_PLAY]:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  [GENRES.STRATEGY]: "bg-green-500/20 text-green-400 border-green-500/30",
  [GENRES.ADVENTURE]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  [GENRES.INDIE]: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  [GENRES.RPG]: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  [GENRES.ANIMATION]: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  [GENRES.VIDEO_PRODUCTION]: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  [GENRES.CASUAL]: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [GENRES.SIMULATION]: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  [GENRES.RACING]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  [GENRES.VIOLENT]: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  [GENRES.MASSIVELY_MULTIPLAYER]:
    "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  [GENRES.NUDITY]: "bg-lime-500/20 text-lime-400 border-lime-500/30",
  [GENRES.SPORTS]: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [GENRES.EARLY_ACCESS]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  [GENRES.GORE]: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  [GENRES.UTILITIES]:
    "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  [GENRES.EA]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  [GENRES.UTILITY]: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  [GENRES.SEXUAL_CONTENT]: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  [GENRES.GAME_DEVELOPMENT]:
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  [GENRES.ACCOUNTING]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  [GENRES.DOCUMENTARY]: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  [GENRES.TUTORIAL]: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
} as const;
