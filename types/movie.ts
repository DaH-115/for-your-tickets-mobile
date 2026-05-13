export interface MovieBaseType {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  runtime: string;
  production_companies: { id: number; name: string }[];
}

export interface MovieList {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genres?: string[];
  certification?: string | null;
}

export interface MovieDetails extends MovieBaseType {
  genres: { id: number; name: string }[];
  certification?: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  original_name: string;
  character: string;
  gender: number;
  profile_path: string | null;
  cast_id: number;
  credit_id: string;
  adult: boolean;
  order: number;
  popularity: number;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  job: string;
  name: string;
  original_name: string;
  profile_path: string | null;
  gender: number;
  adult: boolean;
  credit_id: string;
  department: string;
  known_for_department: string;
  popularity: number;
}

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}
