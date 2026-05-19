import { apiClient } from "./client";

export type S3UploadPurpose = "profile" | "review";

export const s3Api = {
  /**
   * 업로드용 presigned URL 요청 (POST /api/s3)
   * 서버가 purpose에 맞는 key 경로 생성
   * - profile: profile-img/{uid}/{timestamp}_{filename}
   * - review: review-img/{uid}/{timestamp}_{filename}
   */
  getUploadUrl: (
    filename: string,
    contentType: string,
    size: number,
    purpose: S3UploadPurpose = "profile"
  ) =>
    apiClient.post<{ url: string; key: string }>("/api/s3", {
      filename,
      contentType,
      size,
      purpose,
    }),

  /**
   * 다운로드용 presigned URL 요청 (GET /api/s3?key=...)
   */
  getDownloadUrl: (key: string) =>
    apiClient.get<{ url: string; expiresIn: number }>(
      `/api/s3?key=${encodeURIComponent(key)}`
    ),

  /**
   * S3로 이미지 PUT (presignedUrl + binary blob)
   */
  uploadImage: async (
    presignedUrl: string,
    imageUri: string,
    contentType = "image/jpeg"
  ) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const res = await fetch(presignedUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": contentType },
    });

    if (!res.ok) {
      throw new Error(`S3 업로드 실패: ${res.status} ${res.statusText}`);
    }
  },
};
