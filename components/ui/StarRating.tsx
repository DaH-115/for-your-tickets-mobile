import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHaptics } from "@/hooks/useHaptics";
import { COLORS } from "@/constants/theme";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({
  rating,
  onChange,
  size = 32,
  readonly = false,
}: StarRatingProps) {
  const { triggerSelection } = useHaptics();

  const handlePress = (star: number) => {
    if (readonly || !onChange) return;
    triggerSelection();
    onChange(star);
  };

  return (
    <View className="flex-row items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Pressable
          key={i}
          onPress={() => handlePress(i + 1)}
          disabled={readonly}
          style={{ paddingHorizontal: 2 }}
        >
          <Ionicons
            name={i < rating ? "star" : "star-outline"}
            size={size}
            color={COLORS.accent}
          />
        </Pressable>
      ))}
    </View>
  );
}
