import { View, Text } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { commentApi } from "@/services/api/commentApi";
import { useAlertStore } from "@/stores/useAlertStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useHaptics } from "@/hooks/useHaptics";

interface CommentListProps {
  reviewId: string;
}

export default function CommentList({ reviewId }: CommentListProps) {
  const queryClient = useQueryClient();
  const showToast = useAlertStore((s) => s.showToast);
  const user = useAuthStore((s) => s.user);
  const { triggerSuccess, triggerWarning } = useHaptics();

  const { data } = useQuery({
    queryKey: ["comments", reviewId],
    queryFn: () => commentApi.getComments(reviewId),
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => {
      if (!user?.uid) throw new Error("로그인이 필요합니다.");
      return commentApi.createComment(reviewId, user.uid, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });
      triggerSuccess();
    },
    onError: (err) => {
      console.error("[createComment] error:", err);
      const msg = err instanceof Error ? err.message : "댓글 작성 실패";
      showToast(msg, "error");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentApi.updateComment(reviewId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });
    },
    onError: () => showToast("댓글 수정에 실패했습니다.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) =>
      commentApi.deleteComment(reviewId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", reviewId] });
      triggerWarning();
    },
    onError: () => showToast("댓글 삭제에 실패했습니다.", "error"),
  });

  const comments = data?.comments ?? [];

  return (
    <View className="mt-6">
      <Text className="mb-3 text-lg font-bold text-text-primary">
        댓글 {comments.length > 0 && `(${comments.length})`}
      </Text>

      <CommentForm
        onSubmit={(content) => createMutation.mutate(content)}
        loading={createMutation.isPending}
      />

      <View className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={(commentId, content) =>
                updateMutation.mutate({ commentId, content })
              }
              onDelete={(commentId) => deleteMutation.mutate(commentId)}
            />
          ))
        ) : (
          <Text className="py-4 text-center text-base text-text-muted">
            첫 번째 댓글을 남겨보세요!
          </Text>
        )}
      </View>
    </View>
  );
}
