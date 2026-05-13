import { tmdbFetch } from "./client";
import { enrichMovies, fetchMovieCertification } from "./enrich";
import type { MovieList, MovieDetails } from "@/types/movie";

interface TmdbListResponse {
  results: MovieList[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function fetchNowPlayingMovies(
  page = 1
): Promise<TmdbListResponse> {
  const data = await tmdbFetch<TmdbListResponse>("/movie/now_playing", {
    region: "KR",
    page: String(page),
  });
  const enriched = await enrichMovies(data.results.slice(0, 10));
  return { ...data, results: enriched };
}

export async function fetchTrendingMovies(): Promise<TmdbListResponse> {
  const data = await tmdbFetch<TmdbListResponse>("/trending/movie/week");
  const enriched = await enrichMovies(data.results.slice(0, 20));
  return { ...data, results: enriched };
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<TmdbListResponse> {
  return tmdbFetch<TmdbListResponse>("/search/movie", {
    query,
    page: String(page),
  });
}

export async function fetchMovieDetails(
  movieId: number
): Promise<MovieDetails> {
  const [movie, certification] = await Promise.all([
    tmdbFetch<MovieDetails>(`/movie/${movieId}`),
    fetchMovieCertification(movieId),
  ]);

  return {
    ...movie,
    certification,
  };
}

export async function fetchSimilarMovies(
  movieId: number
): Promise<TmdbListResponse> {
  return tmdbFetch<TmdbListResponse>(`/movie/${movieId}/similar`);
}
