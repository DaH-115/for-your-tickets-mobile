import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ReviewPhotoPicker from "@/components/review/ReviewPhotoPicker";
import { reviewApi } from "@/services/api/reviewApi";
import { uploadReviewPhotos } from "@/services/api/reviewPhotoUpload";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAlertStore } from "@/stores/useAlertStore";
import { useHaptics } from "@/hooks/useHaptics";
import { COLORS } from "@/constants/theme";
import type { ReviewDoc } from "@/types/review";
import type { ReviewPhotoDraft } from "@/types/reviewPhoto";

interface ReviewsCache {
  reviews: ReviewDoc[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

function isReviewsCache(data: unknown): data is ReviewsCache {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as ReviewsCache).reviews)
  );
}

function isInfiniteReviewsCache(
  data: unknown
): data is InfiniteData<ReviewsCache> {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as InfiniteData<ReviewsCache>).pages)
  );
}

function updateReviewItem(
  review: ReviewDoc,
  reviewId: string,
  patch: Pick<
    ReviewDoc["review"],
    "rating" | "reviewTitle" | "reviewContent" | "photoKeys"
  >
) {
  if (review.id !== reviewId) return review;

  return {
    ...review,
    review: {
      ...review.review,
      ...patch,
    },
  };
}

function updateReviewsCache(
  data: unknown,
  reviewId: string,
  patch: Pick<
    ReviewDoc["review"],
    "rating" | "reviewTitle" | "reviewContent" | "photoKeys"
  >
) {
  if (isInfiniteReviewsCache(data)) {
    return {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        reviews: page.reviews.map((review) =>
          updateReviewItem(review, reviewId, patch)
        ),
      })),
    };
  }

  if (isReviewsCache(data)) {
    return {
      ...data,
      reviews: data.reviews.map((review) =>
        updateReviewItem(review, reviewId, patch)
      ),
    };
  }

  return data;
}

export default function EditReviewScreen() {
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useAlertStore((s) => s.showToast);
  const { triggerSuccess } = useHaptics();
  const { authLoading } = useProtectedRoute();

  const { data: review, isLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => reviewApi.getReview(reviewId!),
    enabled: !!reviewId,
  });

  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState<ReviewPhotoDraft[]>([]);

  useEffect(() => {
    if (review) {
      setRating(review.review.rating);
      setReviewTitle(review.review.reviewTitle);
      setReviewContent(review.review.reviewContent);
      setReviewPhotos(
        (review.review.photoKeys ?? []).map((photoKey, index) => ({
          id: `existing-${index}-${photoKey}`,
          photoKey,
        }))
      );
    }
  }, [review]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const uploadedPhotoKeys = await uploadReviewPhotos(reviewPhotos);
      let uploadedPhotoIndex = 0;
      const photoKeys = reviewPhotos
        .map((photo) => {
          if (photo.photoKey) return photo.photoKey;
          const uploadedPhotoKey = uploadedPhotoKeys[uploadedPhotoIndex];
          uploadedPhotoIndex += 1;
          return uploadedPhotoKey;
        })
        .filter((photoKey): photoKey is string => !!photoKey);

      await reviewApi.updateReview(reviewId!, {
        rating,
        reviewTitle,
        reviewContent,
        photoKeys,
      });

      return { photoKeys };
    },
    onSuccess: ({ photoKeys }) => {
      triggerSuccess();
      showToast("리뷰가 수정되었습니다!", "success");
      const reviewPatch = {
        rating,
        reviewTitle,
        reviewContent,
        photoKeys,
      };

      queryClient.setQueryData<typeof review>(
        ["review", reviewId],
        (cachedReview) => {
          const currentReview = cachedReview ?? review;

          if (!currentReview) return currentReview;

          return {
            ...currentReview,
            user: currentReview.user,
            review: {
              ...currentReview.review,
              ...reviewPatch,
            },
          };
        }
      );
      queryClient.setQueriesData({ queryKey: ["reviews"] }, (data) =>
        updateReviewsCache(data, reviewId!, reviewPatch)
      );
      queryClient.setQueriesData({ queryKey: ["latestReviews"] }, (data) =>
        updateReviewsCache(data, reviewId!, reviewPatch)
      );
      queryClient.setQueriesData({ queryKey: ["myTickets"] }, (data) =>
        updateReviewsCache(data, reviewId!, reviewPatch)
      );
      queryClient.setQueriesData({ queryKey: ["myReviews"] }, (data) =>
        updateReviewsCache(data, reviewId!, reviewPatch)
      );
      router.back();
    },
    onError: () => showToast("리뷰 수정에 실패했습니다.", "error"),
  });

  if (authLoading || isLoading || !review) {
    return <LoadingSpinner message="리뷰를 불러오는 중..." />;
  }

  const isValid = rating > 0 && reviewTitle.trim() && reviewContent.trim();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
            <Pressable
              onPress={() => router.back()}
              className="flex-row items-center"
              hitSlop={12}
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </Pressable>
            <Text className="text-lg font-bold text-text-primary">
              리뷰 수정
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View className="px-4">
            {/* Movie Info */}
            <View className="rounded-xl bg-surface p-4">
              <Text className="text-base font-bold text-text-primary">
                {review.review.movieTitle}
              </Text>
              <Text className="mt-0.5 text-xs text-text-secondary">
                {review.review.releaseYear}
              </Text>
            </View>

            {/* Rating */}
            <View className="mt-6 items-center">
              <Text className="mb-3 text-base font-bold text-text-primary">
                평점
              </Text>
              <StarRating rating={rating} onChange={setRating} size={40} />
              <Text className="mt-2 text-base text-accent">
                {rating}.0 / 5.0
              </Text>
            </View>

            {/* Review Title */}
            <View className="mt-6">
              <Text className="mb-2 text-base font-medium text-text-secondary">
                리뷰 제목
              </Text>
              <TextInput
                className="rounded-xl border border-gray-600 bg-surface-light px-4 py-3 text-base text-white"
                value={reviewTitle}
                onChangeText={setReviewTitle}
                maxLength={100}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            {/* Review Content */}
            <View className="mt-4">
              <Text className="mb-2 text-base font-medium text-text-secondary">
                리뷰 내용
              </Text>
              <TextInput
                className="rounded-xl border border-gray-600 bg-surface-light px-4 py-3 text-base text-white"
                value={reviewContent}
                onChangeText={setReviewContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                style={{ minHeight: 160 }}
                maxLength={2000}
                placeholderTextColor={COLORS.textMuted}
              />
              <Text className="mt-1 text-right text-xs text-text-muted">
                {reviewContent.length}/2000
              </Text>
            </View>

            <ReviewPhotoPicker
              photos={reviewPhotos}
              onChange={setReviewPhotos}
              disabled={updateMutation.isPending}
            />

            {/* Submit */}
            <Button
              title="리뷰 수정"
              onPress={() => updateMutation.mutate()}
              loading={updateMutation.isPending}
              disabled={!isValid || updateMutation.isPending}
              className="mt-6 mb-8"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
