import { Modal, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { COLORS } from "@/constants/theme";

interface ReviewPhotoGridProps {
  photoKeys?: string[];
}

function ReviewPhoto({
  photoKey,
  onPress,
}: {
  photoKey: string;
  onPress: (photoUrl: string) => void;
}) {
  const photoUrl = usePhotoUrl(photoKey);

  if (!photoUrl) return null;

  return (
    <Pressable
      onPress={() => onPress(photoUrl)}
      style={{ flex: 1, minWidth: "48%" }}
    >
      <Image
        source={{ uri: photoUrl }}
        style={{ width: "100%", height: 140, borderRadius: 8 }}
        contentFit="cover"
      />
    </Pressable>
  );
}

export default function ReviewPhotoGrid({ photoKeys }: ReviewPhotoGridProps) {
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const visiblePhotoKeys = photoKeys?.filter(Boolean) ?? [];

  if (visiblePhotoKeys.length === 0) return null;

  return (
    <>
      <View className="mt-4 flex-row flex-wrap gap-2">
        {visiblePhotoKeys.map((photoKey) => (
          <ReviewPhoto
            key={photoKey}
            photoKey={photoKey}
            onPress={setSelectedPhotoUrl}
          />
        ))}
      </View>

      <Modal
        visible={!!selectedPhotoUrl}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhotoUrl(null)}
      >
        <View className="flex-1 items-center justify-center bg-black/95">
          <Pressable
            className="absolute right-4 top-12 z-10 items-center justify-center rounded-full bg-white/15"
            style={{ width: 44, height: 44 }}
            hitSlop={12}
            onPress={() => setSelectedPhotoUrl(null)}
          >
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </Pressable>

          {selectedPhotoUrl && (
            <Image
              source={{ uri: selectedPhotoUrl }}
              style={{ width: "100%", height: "85%" }}
              contentFit="contain"
            />
          )}
        </View>
      </Modal>
    </>
  );
}
