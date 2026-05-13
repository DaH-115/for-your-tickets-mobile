import { useQuery } from "@tanstack/react-query";
import { s3Api } from "@/services/api/s3Api";

/**
 * photoKey → presigned download URL 해석
 * TTL 보다 짧게 캐시 (기본 서버 TTL 1시간 가정)
 */
export function usePhotoUrl(
  photoKey: string | null | undefined,
  fallbackUrl?: string | null
) {
  const normalizedPhotoKey = photoKey?.trim() || null;
  const isDirectUrl = normalizedPhotoKey
    ? /^https?:\/\//.test(normalizedPhotoKey)
    : false;

  const { data } = useQuery({
    queryKey: ["photoUrl", normalizedPhotoKey],
    queryFn: async () => {
      if (!normalizedPhotoKey) return null;
      const res = await s3Api.getDownloadUrl(normalizedPhotoKey);
      return res.url;
    },
    enabled: !!normalizedPhotoKey && !isDirectUrl,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 50,
  });

  if (isDirectUrl) return normalizedPhotoKey;

  return data ?? fallbackUrl ?? null;
}
