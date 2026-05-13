import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "영화 제목을 검색하세요",
  onClear,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center rounded-xl bg-surface-light px-4 py-3">
      <Ionicons name="search" size={18} color={COLORS.textMuted} />
      <TextInput
        className="ml-2 flex-1 text-base text-white"
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear || (() => onChangeText(""))}>
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </Pressable>
      )}
    </View>
  );
}
