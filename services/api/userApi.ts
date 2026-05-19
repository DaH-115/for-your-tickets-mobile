import { apiClient } from "./client";
import type { User } from "@/types/user";

interface UpdateProfileData {
  displayName?: string;
  biography?: string;
  photoKey?: string;
}

interface SocialProfileResult {
  success: boolean;
  message: string;
  data: {
    uid: string;
    isNewUser: boolean;
    displayName: string;
    provider: "google" | "github";
  };
}

export const userApi = {
  getProfile: (uid: string) => apiClient.get<User>(`/api/users/${uid}`),

  initSocialProfile: (provider: "google" | "github") =>
    apiClient.post<SocialProfileResult>("/api/users/me/profile", { provider }),

  updateProfile: (uid: string, data: UpdateProfileData) =>
    apiClient.put<User>(`/api/users/${uid}`, data),

  deleteAccount: (uid: string) => apiClient.delete(`/api/users/${uid}`),

  getMyProfile: () => apiClient.get<User>("/api/users/me/profile"),

  getLikedReviews: (params: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    return apiClient.get<{
      reviews: import("@/types/review").ReviewDoc[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
    }>(`/api/users/me/liked-reviews?${searchParams.toString()}`);
  },
};
