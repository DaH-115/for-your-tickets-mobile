import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";

import Avatar from "@/components/ui/Avatar";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { formatRelativeDate } from "@/utils/formatDate";
import { COLORS } from "@/constants/theme";
import type { Comment } from "@/services/api/commentApi";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.uid === comment.authorId;
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const photoUrl = usePhotoUrl(comment.photoKey);

  const handleSave = () => {
    if (editContent.trim()) {
      onUpdate(comment.id, editContent.trim());
      setEditing(false);
    }
  };

  return (
    <View className="mb-3 rounded-lg bg-surface-light p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center pr-3">
          <Avatar
            photoUrl={photoUrl}
            displayName={comment.displayName}
            size={28}
          />
          <Text className="ml-2 text-base font-semibold text-text-primary">
            {comment.displayName || "익명"}
          </Text>
        </View>
        <Text className="text-xs text-text-muted">
          {comment.createdAt ? formatRelativeDate(comment.createdAt) : ""}
        </Text>
      </View>

      {editing ? (
        <View className="mt-2">
          <TextInput
            className="rounded-lg border border-gray-600 bg-surface p-2 text-base text-white"
            value={editContent}
            onChangeText={setEditContent}
            multiline
            placeholderTextColor={COLORS.textMuted}
          />
          <View className="mt-2 flex-row justify-end">
            <Pressable
              onPress={() => setEditing(false)}
              className="mr-3 px-3 py-1"
            >
              <Text className="text-sm text-text-muted">취소</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="rounded-lg bg-accent px-3 py-1"
            >
              <Text className="text-sm font-semibold text-white">저장</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <Text className="mt-1 text-base text-text-secondary">
            {comment.content}
          </Text>
          {isOwner && (
            <View className="mt-2 flex-row justify-end">
              <Pressable onPress={() => setEditing(true)} className="mr-3">
                <Text className="text-sm text-accent">수정</Text>
              </Pressable>
              <Pressable onPress={() => onDelete(comment.id)}>
                <Text className="text-sm text-red-500">삭제</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </View>
  );
}
