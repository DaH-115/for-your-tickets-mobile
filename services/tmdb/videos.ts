import { tmdbFetch } from "./client";

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface VideosResponse {
  results: MovieVideo[];
}

export async function fetchMovieVideos(
  movieId: number
): Promise<MovieVideo[]> {
  const data = await tmdbFetch<VideosResponse>(`/movie/${movieId}/videos`);
  return data.results.filter(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  );
}
