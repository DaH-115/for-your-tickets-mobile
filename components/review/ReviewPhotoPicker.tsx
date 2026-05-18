import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import type {
  NewReviewPhotoDraft,
  ReviewPhotoDraft,
} from "@/types/reviewPhoto";

const MAX_REVIEW_PHOTOS = 4;

interface ReviewPhotoPickerProps {
  photos: ReviewPhotoDraft[];
  onChange: (photos: ReviewPhotoDraft[]) => void;
  disabled?: boolean;
}

function createPhotoDraft(
  asset: ImagePicker.ImagePickerAsset,
  index: number
): NewReviewPhotoDraft {
  const contentType = asset.mimeType || "image/jpeg";
  const ext = contentType.split("/")[1] || "jpg";

  return {
    id: `${Date.now()}-${index}-${asset.uri}`,
    uri: asset.uri,
    filename: asset.fileName || `${Date.now()}-${index}.${ext}`,
    contentType,
    size: asset.fileSize,
  };
}

function ReviewPhotoPreview({
  photo,
  disabled,
  onRemove,
}: {
  photo: ReviewPhotoDraft;
  disabled: boolean;
  onRemove: (id: string) => void;
}) {
  const photoUrl = usePhotoUrl(photo.photoKey, photo.uri);

  if (!photoUrl) return null;

  return (
    <View
      className="relative overflow-hidden rounded-lg bg-surface-light"
      style={{ width: 76, height: 76 }}
    >
      <Image
        source={{ uri: photoUrl }}
        style={{ width: 76, height: 76 }}
        contentFit="cover"
      />
      <Pressable
        onPress={() => onRemove(photo.id)}
        disabled={disabled}
        className="absolute right-1 top-1 items-center justify-center rounded-full bg-black/70"
        style={{ width: 24, height: 24, opacity: disabled ? 0.5 : 1 }}
        hitSlop={8}
      >
        <Ionicons name="close" size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

export default function ReviewPhotoPicker({
  photos,
  onChange,
  disabled = false,
}: ReviewPhotoPickerProps) {
  const remainingSlots = MAX_REVIEW_PHOTOS - photos.length;
  const canAdd = remainingSlots > 0 && !disabled;

  const handlePickImages = async () => {
    if (!canAdd) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      quality: 0.85,
    });

    if (result.canceled) return;

    const nextPhotos = result.assets
      .slice(0, remainingSlots)
      .map(createPhotoDraft);

    onChange([...photos, ...nextPhotos]);
  };

  const handleRemove = (id: string) => {
    onChange(photos.filter((photo) => photo.id !== id));
  };

  return (
    <View className="mt-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-medium text-text-secondary">사진</Text>
        <Text className="text-xs text-text-muted">
          {photos.length}/{MAX_REVIEW_PHOTOS}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {photos.map((photo) => (
          <ReviewPhotoPreview
            key={photo.id}
            photo={photo}
            disabled={disabled}
            onRemove={handleRemove}
          />
        ))}

        {canAdd && (
          <Pressable
            onPress={handlePickImages}
            className="items-center justify-center rounded-lg border border-dashed border-gray-600 bg-surface-light"
            style={{ width: 76, height: 76 }}
          >
            <Ionicons name="camera" size={22} color={COLORS.textSecondary} />
            <Text className="mt-1 text-xs text-text-secondary">추가</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
