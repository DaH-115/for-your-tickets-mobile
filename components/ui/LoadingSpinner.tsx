import { View, ActivityIndicator, Text } from "react-native";
import { COLORS } from "@/constants/theme";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
}

export default function LoadingSpinner({
  message,
  size = "large",
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size={size} color={COLORS.accent} />
      {message && (
        <Text className="mt-3 text-sm text-text-secondary">{message}</Text>
      )}
    </View>
  );
}
