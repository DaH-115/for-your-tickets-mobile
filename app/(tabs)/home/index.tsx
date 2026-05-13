import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import MovieCarousel from "@/components/swiper/MovieCarousel";
import MoviePoster from "@/components/movie/MoviePoster";
import ReviewCard from "@/components/review/ReviewCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ProfileHeaderButton from "@/components/ui/ProfileHeaderButton";
import {
  fetchNowPlayingMovies,
  fetchTrendingMovies,
} from "@/services/tmdb/movies";
import { reviewApi } from "@/services/api/reviewApi";
import { getTmdbBackdropUrl } from "@/utils/imageUrl";
import { COLORS } from "@/constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BG_HEIGHT = Math.round(SCREEN_HEIGHT * 0.7);

export default function HomeScreen() {
  const router = useRouter();

  const {
    data: nowPlaying,
    isLoading: loadingNow,
    isError: nowPlayingError,
    refetch: refetchNowPlaying,
  } = useQuery({
    queryKey: ["nowPlaying"],
    queryFn: () => fetchNowPlayingMovies(),
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingMovies,
  });

  const { data: latestReviews } = useQuery({
    queryKey: ["latestReviews"],
    queryFn: () => reviewApi.getReviews({ page: 1, limit: 5 }),
  });

  if (loadingNow) {
    return <LoadingSpinner message="영화 정보를 불러오는 중..." />;
  }

  if (nowPlayingError) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-4 pt-8 pb-4">
          <Text className="text-xl font-bold text-white/80">
            For Your Tickets
          </Text>
          <ProfileHeaderButton />
        </View>
        <View className="flex-1 justify-center">
          <EmptyState
            icon="cloud-offline-outline"
            title="영화 정보를 불러오지 못했습니다"
            description="네트워크 상태를 확인한 뒤 다시 시도해주세요."
            actionLabel="다시 시도"
            onAction={() => refetchNowPlaying()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const firstMovie = nowPlaying?.results?.[0];
  const bgUrl = getTmdbBackdropUrl(firstMovie?.backdrop_path);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Background (첫 번째 상영 중 영화 backdrop) */}
        {bgUrl && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: BG_HEIGHT,
            }}
          >
            <Image
              source={{ uri: bgUrl }}
              style={{ width: "100%", height: BG_HEIGHT }}
              contentFit="cover"
              contentPosition="top"
              transition={300}
            />
            {/* 다크닝 오버레이 (웹: bg-[#121212]/30) */}
            <View
              style={{
                position: "absolute",
                inset: 0 as unknown as undefined,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(18,18,18,0.3)",
              }}
            />
            {/* 세로 fade (웹: from-transparent via-black/10 to-black/70) */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            {/* 하단 페이드: 배경색으로 자연스럽게 사라짐 */}
            <LinearGradient
              colors={["transparent", "rgba(18,18,18,0.8)", COLORS.background]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 160,
              }}
            />
          </View>
        )}

        {/* Header */}
        <View className="relative px-4 pt-8 pb-12">
          <LinearGradient
            colors={[
              "rgba(18,18,18,0.85)",
              "rgba(18,18,18,0.45)",
              "transparent",
            ]}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white/80">
              For Your Tickets
            </Text>
            <ProfileHeaderButton />
          </View>
        </View>

        {/* Now Playing Carousel */}
        {nowPlaying?.results && nowPlaying.results.length > 0 && (
          <View>
            <Text className="mb-4 px-4 text-xl font-bold text-text-primary">
              상영 중인 영화
            </Text>
            <MovieCarousel movies={nowPlaying.results.slice(0, 10)} />
          </View>
        )}

        {/* Trending Section */}
        {trending?.results && trending.results.length > 0 && (
          <View className="mt-12">
            <View className="flex-row items-center justify-between px-4">
              <Text className="text-xl font-bold text-text-primary">
                트렌딩
              </Text>
              <Pressable onPress={() => router.push("/(tabs)/search")}>
                <Text className="text-base text-accent">더보기</Text>
              </Pressable>
            </View>
            <FlatList
              data={trending.results.slice(0, 10)}
              renderItem={({ item }) => (
                <MoviePoster
                  movieId={item.id}
                  posterPath={item.poster_path}
                  title={item.title}
                />
              )}
              keyExtractor={(item) => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
            />
          </View>
        )}

        {/* Latest Reviews */}
        <View className="mt-12 px-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-text-primary">
              최신 리뷰
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/ticket-list")}>
              <Text className="text-base text-accent">전체보기</Text>
            </Pressable>
          </View>
          <View className="mt-4">
            {latestReviews?.reviews && latestReviews.reviews.length > 0 ? (
              latestReviews.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <View className="rounded-xl bg-surface p-6">
                <Text className="text-center text-base text-text-muted">
                  아직 작성된 리뷰가 없습니다
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
