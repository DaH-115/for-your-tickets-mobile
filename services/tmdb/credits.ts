import { tmdbFetch } from "./client";
import type { MovieCredits } from "@/types/movie";

export async function fetchMovieCredits(
  movieId: number
): Promise<MovieCredits> {
  return tmdbFetch<MovieCredits>(`/movie/${movieId}/credits`);
}
