import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";

export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, authLoading, router]);

  return { isAuthenticated, authLoading };
}
