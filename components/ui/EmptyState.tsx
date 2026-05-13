import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "film-outline",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-6 py-12">
      <Ionicons name={icon} size={48} color={COLORS.textMuted} />
      <Text className="mt-4 text-base font-semibold text-text-secondary">
        {title}
      </Text>
      {description && (
        <Text className="mt-1 text-center text-base text-text-muted">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          className="mt-5 rounded-xl border border-accent px-5 py-2.5"
        >
          <Text className="text-base font-bold text-accent">{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
