import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOfflineStore } from "@/stores/useOfflineStore";
import { reviewApi } from "@/services/api/reviewApi";
import type { ReviewDoc } from "@/types/review";

export function useOfflineTickets() {
  const user = useAuthStore((s) => s.user);
  const {
    isOffline,
    cachedTickets,
    lastSyncTime,
    loadCachedTickets,
    updateCache,
  } = useOfflineStore();

  // Load cache on mount
  useEffect(() => {
    if (user?.uid) {
      loadCachedTickets(user.uid);
    }
  }, [user?.uid, loadCachedTickets]);

  // Fetch from API when online
  const { data, isLoading } = useQuery({
    queryKey: ["myTicketsOffline", user?.uid],
    queryFn: () =>
      reviewApi.getReviews({ uid: user?.uid || undefined, limit: 50 }),
    enabled: !!user?.uid && !isOffline,
    staleTime: 1000 * 60 * 5,
  });

  // Update cache when new data arrives
  useEffect(() => {
    if (data?.reviews && user?.uid) {
      updateCache(user.uid, data.reviews);
    }
  }, [data, user?.uid, updateCache]);

  const tickets: ReviewDoc[] = isOffline
    ? cachedTickets || []
    : data?.reviews || cachedTickets || [];

  return {
    tickets,
    isLoading: !isOffline && isLoading,
    isOffline,
    lastSyncTime,
  };
}
