import { getOptionalEnv, getRequiredEnv } from "@/utils/env";

export const API_BASE_URL =
  getOptionalEnv(
    "EXPO_PUBLIC_API_BASE_URL",
    "https://for-your-tickets.vercel.app"
  ) ?? "https://for-your-tickets.vercel.app";

export const TMDB_API_KEY = getRequiredEnv("EXPO_PUBLIC_TMDB_API_KEY");
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const PAGE_SIZE = 14;
