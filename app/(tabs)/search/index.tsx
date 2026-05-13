import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import SearchBar from "@/components/search/SearchBar";
import TrendingSearchRanking from "@/components/search/TrendingSearchRanking";
import MovieCard from "@/components/movie/MovieCard";
import MoviePoster from "@/components/movie/MoviePoster";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ProfileHeaderButton from "@/components/ui/ProfileHeaderButton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  searchMovies,
  fetchTrendingMovies,
  fetchNowPlayingMovies,
} from "@/services/tmdb/movies";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const {
    data: searchResults,
    isLoading: searching,
    isError: searchError,
    refetch: retrySearch,
  } = useQuery({
    queryKey: ["searchMovies", debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingMovies,
    enabled: debouncedQuery.length === 0,
  });

  const { data: nowPlaying } = useQuery({
    queryKey: ["nowPlaying"],
    queryFn: () => fetchNowPlayingMovies(),
    enabled: debouncedQuery.length === 0,
  });

  const isSearching = debouncedQuery.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-4">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-text-primary">검색</Text>
          <ProfileHeaderButton />
        </View>
        <SearchBar value={query} onChangeText={setQuery} />
      </View>

      {isSearching ? (
        // Search Results
        searching ? (
          <LoadingSpinner message="검색 중..." />
        ) : searchError ? (
          <View className="flex-1 justify-center">
            <EmptyState
              icon="cloud-offline-outline"
              title="검색에 실패했습니다"
              description="네트워크 상태를 확인한 뒤 다시 시도해주세요."
              actionLabel="다시 시도"
              onAction={() => retrySearch()}
            />
          </View>
        ) : searchResults?.results && searchResults.results.length > 0 ? (
          <FlatList
            data={searchResults.results}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon="search-outline"
            title="검색 결과가 없습니다"
            description="다른 키워드로 검색해보세요"
          />
        )
      ) : (
        // Default: Trending + Now Playing
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={
            <View>
              {/* 인기 검색어 TOP 10 */}
              {trending?.results && trending.results.length > 0 && (
                <View className="mt-2">
                  <TrendingSearchRanking
                    movies={trending.results}
                    onSelect={(title) => setQuery(title)}
                  />
                </View>
              )}

              {/* Trending Posters */}
              {trending?.results && trending.results.length > 0 && (
                <View className="mt-12">
                  <Text className="mb-4 px-4 text-lg font-bold text-text-primary">
                    이번 주 트렌딩
                  </Text>
                  <FlatList
                    data={trending.results.slice(0, 15)}
                    renderItem={({ item }) => (
                      <MoviePoster
                        movieId={item.id}
                        posterPath={item.poster_path}
                        title={item.title}
                      />
                    )}
                    keyExtractor={(item) => `t-${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                  />
                </View>
              )}

              {/* Now Playing */}
              {nowPlaying?.results && nowPlaying.results.length > 0 && (
                <View className="mt-12">
                  <Text className="mb-4 px-4 text-lg font-bold text-text-primary">
                    현재 상영 중
                  </Text>
                  <FlatList
                    data={nowPlaying.results.slice(0, 15)}
                    renderItem={({ item }) => (
                      <MoviePoster
                        movieId={item.id}
                        posterPath={item.poster_path}
                        title={item.title}
                      />
                    )}
                    keyExtractor={(item) => `np-${item.id}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                  />
                </View>
              )}
              <View className="h-20" />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
