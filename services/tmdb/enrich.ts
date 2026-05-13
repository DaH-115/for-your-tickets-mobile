import { tmdbFetch } from "./client";
import type { MovieList } from "@/types/movie";

interface GenreResponse {
  genres: { id: number; name: string }[];
}

interface ReleaseDateEntry {
  certification: string;
  iso_639_1?: string;
  release_date: string;
  type: number;
}

interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDateEntry[];
}

interface MovieReleaseDatesResponse {
  id: number;
  results: ReleaseDatesResult[];
}

let genreMapCache: Record<number, string> | null = null;

async function fetchGenreMap(): Promise<Record<number, string>> {
  if (genreMapCache) return genreMapCache;
  const { genres } = await tmdbFetch<GenreResponse>("/genre/movie/list", {
    language: "ko",
  });
  genreMapCache = genres.reduce<Record<number, string>>((acc, g) => {
    acc[g.id] = g.name;
    return acc;
  }, {});
  return genreMapCache;
}

const certMap: Record<string, string> = {
  all: "ALL",
  "12": "12",
  "15": "15",
  "18": "18",
  g: "ALL",
  pg: "12",
  "pg-13": "15",
  r: "18",
  전체관람가: "ALL",
  "12세관람가": "12",
  "15세관람가": "15",
  "18세관람가": "18",
};

function normalizeCert(value: string): string | null {
  if (!value) return null;
  return certMap[value.trim().toLowerCase()] ?? null;
}

function pickCertification(data: MovieReleaseDatesResponse): string | null {
  if (!data?.results?.length) return null;
  const kr = data.results.find((r) => r.iso_3166_1 === "KR");
  if (kr?.release_dates?.[0]?.certification) {
    return normalizeCert(kr.release_dates[0].certification);
  }
  const us = data.results.find((r) => r.iso_3166_1 === "US");
  if (us?.release_dates?.[0]?.certification) {
    return normalizeCert(us.release_dates[0].certification);
  }
  return null;
}

export async function fetchMovieCertification(
  id: number
): Promise<string | null> {
  try {
    const data = await tmdbFetch<MovieReleaseDatesResponse>(
      `/movie/${id}/release_dates`
    );
    return pickCertification(data);
  } catch {
    return null;
  }
}

export async function enrichMovies(movies: MovieList[]): Promise<MovieList[]> {
  if (!movies.length) return [];

  const ids = [...new Set(movies.map((m) => m.id))];

  const [genreMap, certEntries] = await Promise.all([
    fetchGenreMap(),
    Promise.all(
      ids.map(async (id) => [id, await fetchMovieCertification(id)] as const)
    ),
  ]);

  const certMapById = new Map(certEntries);

  return movies.map((movie) => ({
    ...movie,
    genres: movie.genre_ids?.map((id) => genreMap[id]).filter(Boolean) ?? [],
    certification: certMapById.get(movie.id) ?? null,
  }));
}
