import { apiClient } from "./client";

export interface Comment {
  id: string;
  authorId: string;
  displayName: string | null;
  photoKey: string | null;
  activityLevel: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export const commentApi = {
  getComments: (reviewId: string) =>
    apiClient.get<{ comments: Comment[] }>(`/api/reviews/${reviewId}/comments`),

  createComment: (reviewId: string, authorId: string, content: string) =>
    apiClient.post<{ success: boolean; id: string; message: string }>(
      `/api/reviews/${reviewId}/comments`,
      { authorId, content }
    ),

  updateComment: (reviewId: string, commentId: string, content: string) =>
    apiClient.put<Comment>(`/api/reviews/${reviewId}/comments/${commentId}`, {
      content,
    }),

  deleteComment: (reviewId: string, commentId: string) =>
    apiClient.delete(`/api/reviews/${reviewId}/comments/${commentId}`),
};
