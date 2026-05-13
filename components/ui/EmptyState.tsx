import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon = "film-outline",
  title,
  description,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-12">
      <Ionicons name={icon} size={48} color={COLORS.textMuted} />
      <Text className="mt-4 text-base font-semibold text-text-secondary">
        {title}
      </Text>
      {description && (
        <Text className="mt-1 text-base text-text-muted">{description}</Text>
      )}
    </View>
  );
}
