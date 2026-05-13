import { TMDB_BASE_URL, TMDB_API_KEY } from "@/utils/constants";
import { assertOkResponse, fetchWithTimeout, readJsonBody } from "@/utils/http";

export async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: "ko-KR",
    ...params,
  });

  const response = await fetchWithTimeout(
    `${TMDB_BASE_URL}${endpoint}?${searchParams}`
  );

  await assertOkResponse(response);

  return (await readJsonBody<T>(response)) as T;
}
