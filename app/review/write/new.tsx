import { useState } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import StarRating from "@/components/ui/StarRating";
import Button from "@/components/ui/Button";
import { reviewApi } from "@/services/api/reviewApi";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAlertStore } from "@/stores/useAlertStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useHaptics } from "@/hooks/useHaptics";
import { COLORS } from "@/constants/theme";

export default function WriteNewReviewScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const showToast = useAlertStore((s) => s.showToast);
  const { triggerSuccess } = useHaptics();
  const { authLoading } = useProtectedRoute();
  const user = useAuthStore((s) => s.user);
  const fetchUserProfile = useAuthStore((s) => s.fetchUserProfile);

  const { movieId, movieTitle, originalTitle, posterPath, releaseYear } =
    useLocalSearchParams<{
      movieId: string;
      movieTitle: string;
      originalTitle: string;
      posterPath: string;
      releaseYear: string;
    }>();

  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");

  const createMutation = useMutation({
    mutationFn: () => {
      if (!user?.uid) throw new Error("로그인이 필요합니다.");
      return reviewApi.createReview({
        user: {
          uid: user.uid,
          displayName: user.displayName,
          photoKey: user.photoKey,
        },
        review: {
          movieId: Number(movieId),
          movieTitle: movieTitle || "",
          originalTitle: originalTitle || "",
          moviePosterPath: posterPath || undefined,
          releaseYear: releaseYear || "",
          rating,
          reviewTitle,
          reviewContent,
        },
      });
    },
    onSuccess: (data) => {
      triggerSuccess();
      showToast("리뷰가 작성되었습니다!", "success");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["latestReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      // 서버가 reviewCount + activityLevel 갱신 → user store 재동기화
      if (user?.uid) fetchUserProfile(user.uid);
      router.replace(`/review/${data.id}`);
    },
    onError: (err) => {
      console.error("[createReview] error:", err);
      const msg =
        err instanceof Error ? err.message : "리뷰 작성에 실패했습니다.";
      showToast(msg, "error");
    },
  });

  const isValid = rating > 0 && reviewTitle.trim() && reviewContent.trim();

  if (authLoading) return null;

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
              리뷰 작성
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View className="px-4">
            {/* Movie Info */}
            <View className="rounded-xl bg-surface p-4">
              <Text className="text-base font-bold text-text-primary">
                {movieTitle}
              </Text>
              {originalTitle && originalTitle !== movieTitle && (
                <Text className="mt-0.5 text-xs text-text-muted">
                  {originalTitle}
                </Text>
              )}
              <Text className="mt-0.5 text-xs text-text-secondary">
                {releaseYear}
              </Text>
            </View>

            {/* Rating */}
            <View className="mt-6 items-center">
              <Text className="mb-3 text-base font-bold text-text-primary">
                평점
              </Text>
              <StarRating rating={rating} onChange={setRating} size={40} />
              <Text className="mt-2 text-base text-accent">
                {rating > 0 ? `${rating}.0 / 5.0` : "별점을 선택하세요"}
              </Text>
            </View>

            {/* Review Title */}
            <View className="mt-6">
              <Text className="mb-2 text-base font-medium text-text-secondary">
                리뷰 제목
              </Text>
              <TextInput
                className="rounded-xl border border-gray-600 bg-surface-light px-4 py-3 text-base text-white"
                placeholder="리뷰 제목을 입력하세요"
                placeholderTextColor={COLORS.textMuted}
                value={reviewTitle}
                onChangeText={setReviewTitle}
                maxLength={100}
              />
            </View>

            {/* Review Content */}
            <View className="mt-4">
              <Text className="mb-2 text-base font-medium text-text-secondary">
                리뷰 내용
              </Text>
              <TextInput
                className="rounded-xl border border-gray-600 bg-surface-light px-4 py-3 text-base text-white"
                placeholder="영화에 대한 감상을 자유롭게 작성해주세요"
                placeholderTextColor={COLORS.textMuted}
                value={reviewContent}
                onChangeText={setReviewContent}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                style={{ minHeight: 160 }}
                maxLength={2000}
              />
              <Text className="mt-1 text-right text-xs text-text-muted">
                {reviewContent.length}/2000
              </Text>
            </View>

            {/* Submit */}
            <Button
              title="리뷰 등록"
              onPress={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!isValid}
              className="mt-6 mb-8"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
