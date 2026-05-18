import type { MovieDetails } from "./movie";

export interface ReviewUser {
  uid: string | null;
  displayName: string | null;
  photoKey: string | null;
  activityLevel?: string;
}

export interface ReviewDoc {
  id: string;
  user: ReviewUser;
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
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    isLiked?: boolean;
  };
  orderNumber?: number;
}

export interface ReviewFormValues {
  reviewTitle: string;
  reviewContent: string;
  rating: number;
  isLiked: boolean;
}

export type ReviewMode = "new" | "edit";

export interface UseReviewDataParams {
  mode: ReviewMode;
  reviewId?: string;
}

export interface UseReviewFormParams {
  mode: ReviewMode;
  reviewId?: string;
  movieData: MovieDetails;
}
