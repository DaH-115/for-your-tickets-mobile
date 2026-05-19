import { s3Api } from "./s3Api";
import type {
  NewReviewPhotoDraft,
  ReviewPhotoDraft,
} from "@/types/reviewPhoto";

export function isNewReviewPhotoDraft(
  photo: ReviewPhotoDraft
): photo is NewReviewPhotoDraft {
  return !photo.photoKey;
}

export async function uploadReviewPhotos(photos: ReviewPhotoDraft[]) {
  const uploadedKeys: string[] = [];

  for (const photo of photos.filter(isNewReviewPhotoDraft)) {
    let size = photo.size;

    if (!size) {
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      size = blob.size;
    }

    const { url, key } = await s3Api.getUploadUrl(
      photo.filename,
      photo.contentType,
      size,
      "review"
    );

    await s3Api.uploadImage(url, photo.uri, photo.contentType);
    uploadedKeys.push(key);
  }

  return uploadedKeys;
}
