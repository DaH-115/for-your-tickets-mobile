import { TMDB_IMAGE_BASE_URL } from "./constants";

type TmdbImageSize =
  | "w92"
  | "w154"
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "original";

export function getTmdbImageUrl(
  path: string | null | undefined,
  size: TmdbImageSize = "w500"
): string | undefined {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getTmdbPosterUrl(
  path: string | null | undefined
): string | undefined {
  return getTmdbImageUrl(path, "w342");
}

export function getTmdbBackdropUrl(
  path: string | null | undefined
): string | undefined {
  return getTmdbImageUrl(path, "w780");
}
