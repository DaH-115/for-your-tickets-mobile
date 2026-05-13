import { useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "@/stores/useAuthStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { COLORS } from "@/constants/theme";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  loading?: boolean;
}

export default function CommentForm({ onSubmit, loading }: CommentFormProps) {
  const [content, setContent] = useState("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useAlertStore((s) => s.showToast);

  const handleSubmit = () => {
    if (!isAuthenticated) {
      showToast("로그인이 필요합니다.", "info");
      return;
    }
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  return (
    <View className="flex-row items-end rounded-xl bg-surface-light p-2">
      <TextInput
        className="flex-1 px-3 py-2 text-base text-white"
        placeholder="댓글을 입력하세요..."
        placeholderTextColor={COLORS.textMuted}
        value={content}
        onChangeText={setContent}
        multiline
        maxLength={500}
      />
      <Pressable
        onPress={handleSubmit}
        disabled={loading || !content.trim()}
        className="ml-2 items-center justify-center rounded-lg bg-accent"
        style={{
          minWidth: 44,
          minHeight: 44,
          opacity: content.trim() ? 1 : 0.4,
        }}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}
