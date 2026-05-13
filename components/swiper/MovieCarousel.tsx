import { useRef } from "react";
import {
  FlatList,
  View,
  Text,
  Dimensions,
  Pressable,
  ViewToken,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getTmdbPosterUrl } from "@/utils/imageUrl";
import { COLORS } from "@/constants/theme";
import MovieCertification from "@/components/movie/MovieCertification";
import DottedDivider from "@/components/ui/DottedDivider";
import TicketPattern from "@/components/ui/TicketPattern";
import type { MovieList } from "@/types/movie";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const POSTER_ASPECT_RATIO = 2 / 3;
const ITEM_WIDTH = Math.min(SCREEN_WIDTH - 96, 252);
const POSTER_HEIGHT = Math.round(ITEM_WIDTH / POSTER_ASPECT_RATIO);
const GAP = 16;
const INFO_CARD_OVERLAP = 96;

interface MovieCarouselProps {
  movies: MovieList[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      // viewability tracking if needed
    },
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }: { item: MovieList; index: number }) => {
    const imageUrl = getTmdbPosterUrl(item.poster_path);
    const releaseYear = item.release_date?.split("-")[0] ?? "";
    const rating = Math.round((item.vote_average ?? 0) * 10) / 10;

    return (
      <View
        style={{
          width: ITEM_WIDTH,
          shadowColor: "#000",
          shadowOpacity: 0.24,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 8,
        }}
      >
        {/* 실제 영화 포스터 비율(2:3)을 유지하는 이미지 영역 */}
        <Pressable
          onPress={() => router.push(`/movie/${item.id}`)}
          className="overflow-hidden rounded-t-2xl"
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: ITEM_WIDTH, height: POSTER_HEIGHT }}
              contentFit="cover"
              transition={300}
            />
          ) : (
            <View
              style={{ width: ITEM_WIDTH, height: POSTER_HEIGHT }}
              className="items-center justify-center bg-surface-light"
            >
              <Text className="text-text-muted">No Image</Text>
            </View>
          )}

          {/* 헤더: 인덱스 표시 — gradient 위→아래 fade */}
          <LinearGradient
            colors={["rgba(0,0,0,0.65)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              paddingHorizontal: 12,
              paddingTop: 10,
              paddingBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text className="text-2xl font-bold text-white">{index + 1}</Text>
          </LinearGradient>

          {/* 포스터 하단이 정보 카드 배경으로 자연스럽게 이어지도록 fade 처리 */}
          <LinearGradient
            colors={["rgba(245,245,245,0)", "rgba(245,245,245,1)"]}
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

          {/* inset border (웹: border-white/20) */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          />
        </Pressable>

        {/* 정보 카드 (흰 배경 + 절취선) */}
        <Pressable
          onPress={() => router.push(`/movie/${item.id}`)}
          className="overflow-hidden rounded-b-2xl"
          style={({ pressed }) => ({
            opacity: pressed ? 0.95 : 1,
            marginTop: -INFO_CARD_OVERLAP,
          })}
        >
          <View
            className="rounded-b-2xl px-4 pb-5"
            style={{ backgroundColor: "#f5f5f5", height: 138 }}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color={COLORS.accent} />
                <Text className="ml-1 text-xl font-bold text-gray-900">
                  {rating || 0}
                </Text>
              </View>
              <MovieCertification certification={item.certification ?? null} />
            </View>
            <Text
              className="text-xl font-bold tracking-tight text-gray-900"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text
              className="mt-1 text-sm tracking-tight text-gray-400"
              numberOfLines={1}
            >
              {item.original_title}
              {releaseYear ? ` (${releaseYear})` : ""}
            </Text>

            <View className="mt-auto flex-row items-center justify-between">
              <Text
                className="flex-1 text-base leading-snug text-gray-800"
                numberOfLines={1}
              >
                {(item.genres ?? []).join(" · ")}
              </Text>
            </View>
          </View>
        </Pressable>

        {/* 티켓 버튼 (Admit One) */}
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/review/write/new",
              params: {
                movieId: String(item.id),
                movieTitle: item.title,
                originalTitle: item.original_title,
                posterPath: item.poster_path ?? "",
                releaseYear,
              },
            })
          }
          className="overflow-hidden rounded-2xl"
        >
          {({ pressed }) => (
            <View
              style={{
                backgroundColor: pressed ? "#e5e5e5" : "#f5f5f5",
              }}
            >
              <DottedDivider width={ITEM_WIDTH} />
              <View className="py-3" style={{ overflow: "hidden" }}>
                {/* 티켓 텍스트 패턴 배경 */}
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
                  className="text-center text-xl font-extrabold tracking-tight p-2"
                  style={{ color: pressed ? "#1f2937" : "#9ca3af" }}
                >
                  Admit One
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={movies}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      horizontal
      snapToInterval={ITEM_WIDTH + GAP}
      snapToAlignment="start"
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
