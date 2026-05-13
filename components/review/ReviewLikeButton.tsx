import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { likeApi } from "@/services/api/likeApi";
import { useHaptics } from "@/hooks/useHaptics";
import { useAlertStore } from "@/stores/useAlertStore";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ReviewDoc } from "@/types/review";
import { COLORS } from "@/constants/theme";

interface ReviewLikeButtonProps {
  reviewId: string;
  initialLiked: boolean;
  initialCount: number;
}

export default function ReviewLikeButton({
  reviewId,
  initialLiked,
  initialCount,
}: ReviewLikeButtonProps) {
  const { triggerLike } = useHaptics();
  const showToast = useAlertStore((s) => s.showToast);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  // 캐시에서 현재 상태 읽기 (없으면 props 폴백)
  const cached = queryClient.getQueryData<ReviewDoc>(["review", reviewId]);
  const isLiked = cached?.review.isLiked ?? initialLiked;
  const likeCount = cached?.review.likeCount ?? initialCount;

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked ? likeApi.unlikeReview(reviewId) : likeApi.likeReview(reviewId),

    onMutate: async () => {
      triggerLike();
      await queryClient.cancelQueries({ queryKey: ["review", reviewId] });

      const prev = queryClient.getQueryData<ReviewDoc>(["review", reviewId]);

      // Optimistic cache 업데이트
      queryClient.setQueryData<ReviewDoc>(["review", reviewId], (old) => {
        if (!old) return old;
        const wasLiked = old.review.isLiked ?? false;
        return {
          ...old,
          review: {
            ...old.review,
            isLiked: !wasLiked,
            likeCount: wasLiked
              ? Math.max(0, old.review.likeCount - 1)
              : old.review.likeCount + 1,
          },
        };
      });

      return { prev };
    },

    onError: (err, _vars, ctx) => {
      const msg = err instanceof Error ? err.message : "";
      const alreadyLiked = msg.includes("이미 좋아요");
      const notLiked = msg.includes("좋아요하지 않은");

      if (!alreadyLiked && !notLiked) {
        // 진짜 실패 — 캐시 롤백 + 토스트
        console.error("[like] error:", msg);
        if (ctx?.prev) {
          queryClient.setQueryData(["review", reviewId], ctx.prev);
        }
        showToast(msg || "좋아요 처리 실패", "error");
      }
    },

    onSettled: () => {
      // 상세 + 목록 전부 재검증 (likeCount 서버 최신값 반영)
      queryClient.invalidateQueries({ queryKey: ["review", reviewId] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["latestReviews"] });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["likedReviews"] });
    },
  });

  const handlePress = () => {
    if (!isAuthenticated) {
      showToast("로그인이 필요합니다.", "info");
      return;
    }
    likeMutation.mutate();
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center rounded-full bg-surface-light px-4 py-2"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={20}
        color={isLiked ? COLORS.primary : COLORS.textMuted}
      />
      <Text
        className={`ml-2 text-sm font-semibold ${
          isLiked ? "text-primary" : "text-text-muted"
        }`}
      >
        {likeCount}
      </Text>
    </Pressable>
  );
}
