import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import ReviewCard from "@/components/review/ReviewCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuthStore } from "@/stores/useAuthStore";
import { reviewApi } from "@/services/api/reviewApi";
import { COLORS } from "@/constants/theme";
import { PAGE_SIZE } from "@/utils/constants";

export default function MyTicketsScreen() {
  const router = useRouter();
  const { authLoading } = useProtectedRoute();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["myTickets", user?.uid],
      queryFn: ({ pageParam = 1 }) =>
        reviewApi.getReviews({
          page: pageParam,
          limit: PAGE_SIZE,
          uid: user?.uid || undefined,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
      initialPageParam: 1,
      enabled: !!user?.uid,
    });

  if (authLoading || isLoading) {
    return <LoadingSpinner message="내 티켓을 불러오는 중..." />;
  }

  const reviews = data?.pages.flatMap((p) => p.reviews) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>
        <Text className="ml-3 text-lg font-bold text-text-primary">
          내 티켓
        </Text>
      </View>

      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewCard review={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          onEndReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={COLORS.accent}
                style={{ padding: 16 }}
              />
            ) : null
          }
        />
      ) : (
        <EmptyState
          icon="ticket-outline"
          title="작성한 리뷰가 없습니다"
          description="영화를 보고 첫 번째 리뷰를 작성해보세요!"
        />
      )}
    </SafeAreaView>
  );
}
