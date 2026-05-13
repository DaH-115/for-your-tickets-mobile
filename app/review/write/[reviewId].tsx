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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { reviewApi } from "@/services/api/reviewApi";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAlertStore } from "@/stores/useAlertStore";
import { useHaptics } from "@/hooks/useHaptics";
import { COLORS } from "@/constants/theme";

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

  useEffect(() => {
    if (review) {
      setRating(review.review.rating);
      setReviewTitle(review.review.reviewTitle);
      setReviewContent(review.review.reviewContent);
    }
  }, [review]);

  const updateMutation = useMutation({
    mutationFn: () =>
      reviewApi.updateReview(reviewId!, {
        rating,
        reviewTitle,
        reviewContent,
      }),
    onSuccess: () => {
      triggerSuccess();
      showToast("리뷰가 수정되었습니다!", "success");
      queryClient.invalidateQueries({ queryKey: ["review", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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

            {/* Submit */}
            <Button
              title="리뷰 수정"
              onPress={() => updateMutation.mutate()}
              loading={updateMutation.isPending}
              disabled={!isValid}
              className="mt-6 mb-8"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
