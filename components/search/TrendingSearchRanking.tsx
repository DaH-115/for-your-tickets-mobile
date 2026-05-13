import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";
import { getTrendingUpdateTime } from "@/utils/formatDate";
import type { MovieList } from "@/types/movie";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TrendingSearchRankingProps {
  movies: MovieList[];
  onSelect: (title: string) => void;
}

interface RankItemProps {
  movie: MovieList;
  rank: number;
  onSelect: (title: string) => void;
}

function RankItem({ movie, rank, onSelect }: RankItemProps) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "";
  const rating = movie.vote_average
    ? Math.round(movie.vote_average * 10) / 10
    : 0;
  const isTop3 = rank <= 3;

  return (
    <Pressable
      onPress={() => onSelect(movie.title)}
      className="flex-row items-center px-2"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        minHeight: 44,
      })}
      hitSlop={4}
    >
      <Text
        className="font-extrabold"
        style={{
          width: 28,
          fontSize: 18,
          color: isTop3 ? COLORS.accent : COLORS.textPrimary,
        }}
      >
        {rank}
      </Text>
      <View className="flex-1 pr-2">
        <Text
          className="text-base font-medium text-text-primary"
          numberOfLines={1}
        >
          {movie.title}
        </Text>
        <View className="mt-0.5 flex-row items-center">
          <Ionicons name="star" size={12} color={COLORS.accent} />
          <Text className="ml-1 text-xs text-text-muted">{rating}</Text>
          <Text className="mx-1.5 text-xs text-text-muted">·</Text>
          <Text className="text-xs text-text-muted">
            {year || "개봉년도 미상"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function TrendingSearchRanking({
  movies,
  onSelect,
}: TrendingSearchRankingProps) {
  const [expanded, setExpanded] = useState(false);
  const list = movies.slice(0, 10);
  const top5 = list.slice(0, 5);
  const rest = list.slice(5, 10);

  if (list.length === 0) return null;

  return (
    <View className="px-4">
      <Text className="mb-4 text-xl font-bold text-text-primary">
        인기 검색어 TOP 10
      </Text>

      <View className="gap-2">
        {top5.map((movie, idx) => (
          <RankItem
            key={movie.id}
            movie={movie}
            rank={idx + 1}
            onSelect={onSelect}
          />
        ))}

        {expanded &&
          rest.map((movie, idx) => (
            <RankItem
              key={movie.id}
              movie={movie}
              rank={idx + 6}
              onSelect={onSelect}
            />
          ))}
      </View>

      {rest.length > 0 && (
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext({
              duration: 280,
              create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
              },
              update: {
                type: LayoutAnimation.Types.easeInEaseOut,
              },
              delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
              },
            });
            setExpanded(!expanded);
          }}
          className="mt-3 flex-row items-center justify-center"
          style={{ minHeight: 44 }}
          hitSlop={8}
        >
          <Text className="mr-1 text-sm font-semibold text-text-secondary">
            {expanded ? "접기" : "더 보기"}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={COLORS.textSecondary}
          />
        </Pressable>
      )}

      <View className="mt-3 border-t pt-3" style={{ borderColor: "#2a2a2a" }}>
        <Text className="text-xs text-text-muted">
          TMDB 트렌딩 기준 · {getTrendingUpdateTime()}
        </Text>
      </View>
    </View>
  );
}
