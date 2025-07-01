import { CheckCircle, Gamepad, Heart } from "lucide-react";

export const STATUSES = {
  WISHLIST: "wishlist",
  PLAYLIST: "playlist",
  DONE: "done",
} as const;

export const STATUS_LABELS = {
  [STATUSES.WISHLIST]: "Wishlist",
  [STATUSES.PLAYLIST]: "Playlist",
  [STATUSES.DONE]: "Done",
} as const;

export const STATUS_ICONS = {
  [STATUSES.WISHLIST]: Heart,
  [STATUSES.PLAYLIST]: Gamepad,
  [STATUSES.DONE]: CheckCircle,
} as const;
