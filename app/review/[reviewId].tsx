import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import ReviewLikeButton from "@/components/review/ReviewLikeButton";
import CommentList from "@/components/review/comment/CommentList";
import TicketCapture from "@/components/ticket/TicketCapture";
import Avatar from "@/components/ui/Avatar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { reviewApi } from "@/services/api/reviewApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { useTicketShare } from "@/hooks/useTicketShare";
import { useHaptics } from "@/hooks/useHaptics";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { getTmdbPosterUrl } from "@/utils/imageUrl";
import { formatDate } from "@/utils/formatDate";
import { COLORS } from "@/constants/theme";

export default function ReviewDetailScreen() {
  const { reviewId } = useLocalSearchParams<{ reviewId: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const showToast = useAlertStore((s) => s.showToast);
  const queryClient = useQueryClient();
  const { viewShotRef, captureAndShare } = useTicketShare();
  const { triggerWarning } = useHaptics();

  const { data: review, isLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => reviewApi.getReview(reviewId!),
    enabled: !!reviewId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => reviewApi.deleteReview(reviewId!),
    onSuccess: () => {
      triggerWarning();
      showToast("리뷰가 삭제되었습니다.", "success");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      router.back();
    },
    onError: () => showToast("리뷰 삭제에 실패했습니다.", "error"),
  });
  const authorPhotoUrl = usePhotoUrl(review?.user.photoKey);

  if (isLoading || !review) {
    return <LoadingSpinner message="리뷰를 불러오는 중..." />;
  }

  const isOwner = user?.uid === review.user.uid;
  const posterUrl = getTmdbPosterUrl(review.review.moviePosterPath);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center"
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            <Text className="ml-2 text-base text-text-primary">뒤로</Text>
          </Pressable>
          <View className="flex-row items-center">
            {/* Share Button */}
            <Pressable onPress={captureAndShare} className="mr-4" hitSlop={12}>
              <Ionicons name="share-outline" size={22} color={COLORS.accent} />
            </Pressable>
            {isOwner && (
              <>
                <Pressable
                  onPress={() => router.push(`/review/write/${reviewId}`)}
                  className="mr-4"
                >
                  <Ionicons
                    name="create-outline"
                    size={22}
                    color={COLORS.textPrimary}
                  />
                </Pressable>
                <Pressable onPress={() => deleteMutation.mutate()}>
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={COLORS.error}
                  />
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Ticket Capture Area (hidden for share) */}
        <View style={{ position: "absolute", left: -9999 }}>
          <TicketCapture ref={viewShotRef} review={review} />
        </View>

        <View className="px-4">
          {/* Movie Info */}
          <View className="flex-row items-start">
            {posterUrl && (
              <Image
                source={{ uri: posterUrl }}
                style={{ width: 80, height: 120, borderRadius: 8 }}
                contentFit="cover"
              />
            )}
            <View className="ml-3 flex-1">
              <Text className="text-sm text-text-muted">
                {review.review.movieTitle} ({review.review.releaseYear})
              </Text>
              <Text className="mt-1 text-xl font-bold text-text-primary">
                {review.review.reviewTitle}
              </Text>
              {/* Rating */}
              <View className="mt-2 flex-row items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < review.review.rating ? "star" : "star-outline"}
                    size={16}
                    color={COLORS.accent}
                  />
                ))}
                <Text className="ml-2 text-sm text-accent">
                  {review.review.rating}.0
                </Text>
              </View>
            </View>
          </View>

          {/* Author & Date */}
          <View className="mt-4 flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center pr-3">
              <Avatar
                photoUrl={authorPhotoUrl}
                displayName={review.user.displayName}
                size={32}
              />
              <Text className="ml-2 text-base text-text-secondary">
                {review.user.displayName || "익명"}
              </Text>
            </View>
            <Text className="text-xs text-text-muted">
              {formatDate(review.review.createdAt)}
            </Text>
          </View>

          {/* Review Content */}
          <View className="mt-4 rounded-xl bg-surface p-4">
            <Text className="text-base leading-6 text-text-primary">
              {review.review.reviewContent}
            </Text>
          </View>

          {/* Like Button */}
          <View className="mt-4 flex-row">
            <ReviewLikeButton
              reviewId={review.id}
              initialLiked={review.review.isLiked ?? false}
              initialCount={review.review.likeCount}
            />
          </View>

          {/* Comments */}
          <CommentList reviewId={review.id} />

          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
