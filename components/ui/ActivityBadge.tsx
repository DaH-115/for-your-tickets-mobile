import { View, Text } from "react-native";

const badgeConfig: Record<string, { bg: string; text: string; label: string }> =
  {
    NEWBIE: { bg: "bg-gray-600", text: "text-gray-200", label: "NEWBIE" },
    REGULAR: { bg: "bg-blue-600", text: "text-blue-100", label: "REGULAR" },
    ACTIVE: { bg: "bg-purple-600", text: "text-purple-100", label: "ACTIVE" },
    EXPERT: { bg: "bg-amber-600", text: "text-amber-100", label: "EXPERT" },
  };

interface ActivityBadgeProps {
  level: string;
  size?: "sm" | "md";
}

export default function ActivityBadge({
  level,
  size = "sm",
}: ActivityBadgeProps) {
  const config = badgeConfig[level] || badgeConfig.NEWBIE;
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const fontSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className={`rounded-full ${config.bg} ${padding}`}>
      <Text className={`font-bold ${config.text} ${fontSize}`}>
        {config.label}
      </Text>
    </View>
  );
}
