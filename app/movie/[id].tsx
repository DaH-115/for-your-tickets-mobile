import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import VideoPlayer from "@/components/movie/VideoPlayer";
import MoviePoster from "@/components/movie/MoviePoster";
import MovieCertification from "@/components/movie/MovieCertification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DottedDivider from "@/components/ui/DottedDivider";
import TicketPattern from "@/components/ui/TicketPattern";
import { fetchMovieDetails, fetchSimilarMovies } from "@/services/tmdb/movies";
import { fetchMovieCredits } from "@/services/tmdb/credits";
import { fetchMovieVideos } from "@/services/tmdb/videos";
import { getTmdbBackdropUrl, getTmdbImageUrl } from "@/utils/imageUrl";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/useAuthStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TICKET_BUTTON_WIDTH = SCREEN_WIDTH - 32;
const OVERVIEW_PARAGRAPH_SENTENCE_LIMIT = 2;
const OVERVIEW_PARAGRAPH_LENGTH_LIMIT = 180;

function splitOverviewIntoParagraphs(overview: string) {
  const normalizedOverview = overview.trim();
  const manualParagraphs = normalizedOverview
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (manualParagraphs.length > 1) {
    return manualParagraphs;
  }

  const sentences =
    normalizedOverview
      .replace(/\s+/g, " ")
      .match(/[^.!?。！？]+[.!?。！？]*["'”’)]*/g)
      ?.map((sentence) => sentence.trim())
      .filter(Boolean) ?? [];

  if (sentences.length <= 1) {
    return [normalizedOverview];
  }

  const paragraphs: string[] = [];
  let currentParagraph = "";
  let currentSentenceCount = 0;

  sentences.forEach((sentence) => {
    if (!currentParagraph) {
      currentParagraph = sentence;
      currentSentenceCount = 1;
      return;
    }

    const nextParagraph = `${currentParagraph} ${sentence}`;

    if (
      currentSentenceCount < OVERVIEW_PARAGRAPH_SENTENCE_LIMIT &&
      nextParagraph.length <= OVERVIEW_PARAGRAPH_LENGTH_LIMIT
    ) {
      currentParagraph = nextParagraph;
      currentSentenceCount += 1;
      return;
    }

    paragraphs.push(currentParagraph);
    currentParagraph = sentence;
    currentSentenceCount = 1;
  });

  if (currentParagraph) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs;
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const movieId = Number(id);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movieDetails", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ["movieCredits", movieId],
    queryFn: () => fetchMovieCredits(movieId),
    enabled: !!movieId,
  });

  const { data: videos } = useQuery({
    queryKey: ["movieVideos", movieId],
    queryFn: () => fetchMovieVideos(movieId),
    enabled: !!movieId,
  });

  const { data: similar } = useQuery({
    queryKey: ["similarMovies", movieId],
    queryFn: () => fetchSimilarMovies(movieId),
    enabled: !!movieId,
  });

  if (isLoading || !movie) {
    return <LoadingSpinner message="영화 정보를 불러오는 중..." />;
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbImageUrl(movie.poster_path, "w342");
  const director = credits?.crew.find((c) => c.job === "Director");
  const overviewParagraphs = movie.overview
    ? splitOverviewIntoParagraphs(movie.overview)
    : [];

  const writeReviewPath =
    `/review/write/new?movieId=${movie.id}` +
    `&movieTitle=${encodeURIComponent(movie.title)}` +
    `&originalTitle=${encodeURIComponent(movie.original_title)}` +
    `&posterPath=${encodeURIComponent(movie.poster_path || "")}` +
    `&releaseYear=${movie.release_date?.slice(0, 4)}`;

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      router.push({
        pathname: "/(auth)/login",
        params: { returnTo: writeReviewPath },
      });
      return;
    }
    router.push(writeReviewPath);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute left-4 top-2 z-10 rounded-full bg-black/50 p-2"
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>

        {/* Backdrop */}
        <View style={{ height: 300 }}>
          {backdropUrl ? (
            <Image
              source={{ uri: backdropUrl }}
              style={{ width: "100%", height: 300 }}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View style={{ height: 300 }} className="bg-surface-light" />
          )}
          <LinearGradient
            colors={["transparent", COLORS.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
            }}
          />
          <View className="absolute bottom-4 left-4 overflow-hidden rounded-xl bg-surface-light">
            {posterUrl ? (
              <Image
                source={{ uri: posterUrl }}
                style={{ width: 120, height: 180 }}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View
                style={{ width: 120, height: 180 }}
                className="items-center justify-center"
              >
                <Text className="text-center text-xs text-text-muted">
                  No Image
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Movie Info */}
        <View className="px-4 pt-4">
          <View>
            <View className="flex-row flex-wrap items-center">
              <Text className="text-2xl font-bold text-text-primary">
                {movie.title}
              </Text>
              <View className="ml-2">
                <MovieCertification certification={movie.certification} />
              </View>
            </View>
            {movie.original_title !== movie.title && (
              <Text className="mt-0.5 text-lg text-text-muted">
                {movie.original_title}
              </Text>
            )}
          </View>

          {/* Meta */}
          <View className="mt-3 flex-row flex-wrap items-center">
            <Ionicons name="star" size={18} color={COLORS.accent} />
            <Text className="ml-1 text-base font-bold text-accent">
              {movie.vote_average?.toFixed(1)}
            </Text>
            <Text className="mx-2 text-text-muted">|</Text>
            <Text className="text-base text-text-secondary">
              {movie.release_date}
            </Text>
            {movie.runtime && (
              <>
                <Text className="mx-2 text-text-muted">|</Text>
                <Text className="text-base text-text-secondary">
                  {movie.runtime}분
                </Text>
              </>
            )}
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <View key={genre.id} className="mb-2">
                  <Text className="text-sm text-white">{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Director */}
          {director && (
            <Text className="mt-1 text-base text-text-secondary">
              감독: <Text className="text-text-primary">{director.name}</Text>
            </Text>
          )}

          {/* Overview */}
          {overviewParagraphs.length > 0 && (
            <View className="mt-10">
              <Text className="mb-3 text-lg font-bold text-text-primary">
                줄거리
              </Text>
              <View className="gap-3">
                {overviewParagraphs.map((paragraph, index) => (
                  <Text
                    key={`${paragraph.slice(0, 24)}-${index}`}
                    className="text-base leading-6 text-text-secondary"
                  >
                    {paragraph}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Write Review Button */}
          <Pressable
            onPress={handleWriteReview}
            className="mt-12 overflow-hidden rounded-2xl"
          >
            {({ pressed }) => (
              <View
                style={{
                  backgroundColor: pressed ? "#e5e5e5" : "#f5f5f5",
                }}
              >
                <DottedDivider width={TICKET_BUTTON_WIDTH} />
                <View className="py-6" style={{ overflow: "hidden" }}>
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <TicketPattern />
                  </View>
                  <Text
                    className="text-center text-xl font-extrabold tracking-tight"
                    style={{ color: pressed ? "#1f2937" : "#9ca3af" }}
                  >
                    Admit One
                  </Text>
                </View>
              </View>
            )}
          </Pressable>

          {/* Trailers */}
          {videos && videos.length > 0 && (
            <View className="mt-12">
              <Text className="mb-4 text-lg font-bold text-text-primary">
                트레일러
              </Text>
              {videos.slice(0, 2).map((video) => (
                <VideoPlayer
                  key={video.id}
                  videoKey={video.key}
                  title={video.name}
                />
              ))}
            </View>
          )}

          {/* Cast */}
          {credits?.cast && credits.cast.length > 0 && (
            <View className="mt-12">
              <Text className="mb-4 text-lg font-bold text-text-primary">
                출연진
              </Text>
              <FlatList
                data={credits.cast.slice(0, 20)}
                renderItem={({ item }) => (
                  <View className="mr-4 w-16 items-center">
                    {item.profile_path ? (
                      <Image
                        source={{
                          uri: getTmdbImageUrl(item.profile_path, "w185")!,
                        }}
                        style={{ width: 56, height: 56, borderRadius: 28 }}
                        contentFit="cover"
                      />
                    ) : (
                      <View
                        style={{ width: 56, height: 56, borderRadius: 28 }}
                        className="items-center justify-center bg-surface-light"
                      >
                        <Ionicons
                          name="person"
                          size={24}
                          color={COLORS.textMuted}
                        />
                      </View>
                    )}
                    <Text
                      className="mt-1 text-center text-base text-text-primary"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-center text-sm text-text-muted"
                      numberOfLines={1}
                    >
                      {item.character}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {/* Similar Movies */}
          {similar?.results && similar.results.length > 0 && (
            <View className="mt-12">
              <Text className="mb-4 text-lg font-bold text-text-primary">
                비슷한 영화
              </Text>
              <FlatList
                data={similar.results.slice(0, 10)}
                renderItem={({ item }) => (
                  <MoviePoster
                    movieId={item.id}
                    posterPath={item.poster_path}
                    title={item.title}
                    width={120}
                    height={180}
                  />
                )}
                keyExtractor={(item) => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
