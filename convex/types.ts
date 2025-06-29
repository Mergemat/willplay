interface PriceOverview {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

interface Category {
  id: number;
  description: string;
}

interface Genre {
  id: string;
  description: string;
}

interface ContentDescriptors {
  ids: unknown[];
  notes: null;
}

interface RatingDetails {
  rating_generated: string;
  rating: string;
  required_age: string;
  banned: string;
  use_age_gate: string;
  descriptors: string;
}

interface Ratings {
  dejus: RatingDetails;
  steam_germany: RatingDetails;
}
export interface AppData {
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
}

export interface SteamApiResponse {
  success: boolean;
  data: AppData;
}
