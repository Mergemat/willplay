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
