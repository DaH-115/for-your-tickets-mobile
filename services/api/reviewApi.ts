import { apiClient } from "./client";
import type { ReviewDoc } from "@/types/review";

interface ReviewsResponse {
  reviews: ReviewDoc[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const reviewApi = {
  getReviews: (params: {
    page?: number;
    limit?: number;
    search?: string;
    uid?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.uid) searchParams.set("uid", params.uid);
    return apiClient.get<ReviewsResponse>(
      `/api/reviews?${searchParams.toString()}`
    );
  },

  getReview: (id: string) => apiClient.get<ReviewDoc>(`/api/reviews/${id}`),

  createReview: (data: {
    user: {
      uid: string;
      displayName: string | null;
      photoKey: string | null;
    };
    review: {
      movieId: number;
      movieTitle: string;
      originalTitle: string;
      moviePosterPath?: string;
      releaseYear: string;
      rating: number;
      reviewTitle: string;
      reviewContent: string;
      photoKeys?: string[];
    };
  }) =>
    apiClient.post<{ success: boolean; id: string; message: string }>(
      "/api/reviews",
      {
        user: data.user,
        review: {
          ...data.review,
          likeCount: 0,
          isLiked: false,
        },
      }
    ),

  updateReview: (
    id: string,
    data: {
      rating?: number;
      reviewTitle?: string;
      reviewContent?: string;
      photoKeys?: string[];
    }
  ) => apiClient.put<ReviewDoc>(`/api/reviews/${id}`, data),

  deleteReview: (id: string) => apiClient.delete(`/api/reviews/${id}`),
};
