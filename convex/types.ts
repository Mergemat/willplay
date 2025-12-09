type PriceOverview = {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
};

type Category = {
  id: number;
  description: string;
};

type Genre = {
  id: string;
  description: string;
};

type ContentDescriptors = {
  ids: unknown[];
  notes: null;
};

type RatingDetails = {
  rating_generated: string;
  rating: string;
  required_age: string;
  banned: string;
  use_age_gate: string;
  descriptors: string;
};

type Ratings = {
  dejus: RatingDetails;
  steam_germany: RatingDetails;
};
export type AppData = {
  type: string;
  name: string;
  steam_appid: number;
  is_free: boolean;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  price_overview: PriceOverview;
  categories: Category[];
  genres: Genre[];
  background: string;
  background_raw: string;
  content_descriptors: ContentDescriptors;
  ratings: Ratings;
};

export type SteamApiResponse = {
  success: boolean;
  data: AppData;
};
