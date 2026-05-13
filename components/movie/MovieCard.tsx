import { Pressable, View, Text } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTmdbPosterUrl } from "@/utils/imageUrl";
import { COLORS } from "@/constants/theme";
import type { MovieList } from "@/types/movie";

interface MovieCardProps {
  movie: MovieList;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const imageUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <Pressable
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="mb-4 flex-row rounded-xl bg-surface p-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 80, height: 120, borderRadius: 8 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={{ width: 80, height: 120, borderRadius: 8 }}
          className="items-center justify-center bg-surface-light"
        >
          <Text className="text-text-muted text-xs">No Image</Text>
        </View>
      )}
      <View className="ml-3 flex-1 justify-center">
        <Text className="text-base font-bold text-text-primary" numberOfLines={2}>
          {movie.title}
        </Text>
        {movie.original_title !== movie.title && (
          <Text className="mt-0.5 text-xs text-text-muted" numberOfLines={1}>
            {movie.original_title}
          </Text>
        )}
        <Text className="mt-1 text-xs text-text-secondary">
          {movie.release_date?.slice(0, 4)}
        </Text>
        <View className="mt-2 flex-row items-center">
          <Ionicons name="star" size={16} color={COLORS.accent} />
          <Text className="ml-1 text-sm font-semibold text-accent">
            {movie.vote_average?.toFixed(1)}
          </Text>
        </View>
        {movie.overview && (
          <Text className="mt-2 text-sm text-text-muted" numberOfLines={2}>
            {movie.overview}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
