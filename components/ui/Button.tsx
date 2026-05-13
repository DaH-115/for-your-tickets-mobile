import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { COLORS } from "@/constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseClass = "w-full rounded-2xl p-4 items-center justify-center flex-row";
  const variantClass = {
    primary: "bg-accent",
    secondary: "bg-surface-light border border-gray-600",
    outline: "border border-accent bg-transparent",
  }[variant];

  const textClass = {
    primary: "text-white font-bold text-base",
    secondary: "text-text-primary font-semibold text-base",
    outline: "text-accent font-bold text-base",
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`${baseClass} ${variantClass} ${isDisabled ? "opacity-50" : ""} ${className}`}
      style={({ pressed }) => [
        { opacity: pressed && !isDisabled ? 0.8 : isDisabled ? 0.5 : 1 },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? COLORS.accent : "#fff"}
          style={{ marginRight: 8 }}
        />
      )}
      <Text className={textClass}>{loading ? "처리 중..." : title}</Text>
    </Pressable>
  );
}
