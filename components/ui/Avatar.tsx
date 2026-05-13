import { View, Text } from "react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";

interface AvatarProps {
  photoUrl?: string | null;
  displayName?: string | null;
  size?: number;
}

export default function Avatar({
  photoUrl,
  displayName,
  size = 64,
}: AvatarProps) {
  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  const normalizedDisplayName = displayName?.trim();
  const initial = normalizedDisplayName
    ? Array.from(normalizedDisplayName)[0]
    : null;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: COLORS.primaryLight,
      }}
      className="items-center justify-center"
    >
      {initial && (
        <Text
          style={{ fontSize: size * 0.4, color: "#fff", fontWeight: "bold" }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}
