import { Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { getTmdbPosterUrl } from "@/utils/imageUrl";

interface MoviePosterProps {
  movieId: number;
  posterPath: string | null | undefined;
  title: string;
  width?: number;
  height?: number;
  showTitle?: boolean;
}

export default function MoviePoster({
  movieId,
  posterPath,
  title,
  width = 140,
  height = 210,
  showTitle = true,
}: MoviePosterProps) {
  const router = useRouter();
  const imageUrl = getTmdbPosterUrl(posterPath);

  return (
    <Pressable
      onPress={() => router.push(`/movie/${movieId}`)}
      className="mr-3"
      style={{ width }}
    >
      <View style={{ width, height, borderRadius: 12, overflow: "hidden" }}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width, height }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={{ width, height }}
            className="items-center justify-center bg-surface-light"
          >
            <Text className="text-text-muted">No Image</Text>
          </View>
        )}
        {/* inset border (웹: border-white/20) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.2)",
          }}
        />
      </View>
      {showTitle && (
        <Text
          className="mt-2 text-sm text-text-primary"
          numberOfLines={2}
          style={{ width }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
