import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";

import SearchBar from "@/components/search/SearchBar";
import ReviewCard from "@/components/review/ReviewCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ProfileHeaderButton from "@/components/ui/ProfileHeaderButton";
import { useDebounce } from "@/hooks/useDebounce";
import { reviewApi } from "@/services/api/reviewApi";
import { COLORS } from "@/constants/theme";
import { PAGE_SIZE } from "@/utils/constants";

export default function TicketListScreen() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      reviewApi.getReviews({
        page: pageParam,
        limit: PAGE_SIZE,
        search: debouncedQuery || undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];

  if (isLoading) {
    return <LoadingSpinner message="리뷰를 불러오는 중..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-4">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-text-primary">
            티켓 목록
          </Text>
          <ProfileHeaderButton />
        </View>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="리뷰 제목, 영화 제목으로 검색"
        />
      </View>

      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewCard review={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator size="small" color={COLORS.accent} />
              </View>
            ) : null
          }
        />
      ) : (
        <EmptyState
          icon="ticket-outline"
          title="리뷰가 없습니다"
          description={
            debouncedQuery
              ? "다른 키워드로 검색해보세요"
              : "첫 번째 리뷰를 작성해보세요!"
          }
        />
      )}
    </SafeAreaView>
  );
}
