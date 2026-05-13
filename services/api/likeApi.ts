import { apiClient } from "./client";

export const likeApi = {
  likeReview: (reviewId: string) =>
    apiClient.post<{ success: boolean; likeCount: number; isLiked: boolean }>(
      `/api/reviews/${reviewId}/likes`,
      {}
    ),

  unlikeReview: (reviewId: string) =>
    apiClient.delete<{ success: boolean; likeCount: number; isLiked: boolean }>(
      `/api/reviews/${reviewId}/likes/me`
    ),

  // 여러 리뷰 좋아요 여부 일괄 조회 (웹 API: POST /api/reviews/likes)
  getLikesMap: (reviewIds: string[]) =>
    apiClient.post<{ likes: Record<string, boolean> }>(
      "/api/reviews/likes",
      { reviewIds }
    ),
};
