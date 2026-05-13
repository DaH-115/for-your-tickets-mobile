import { useEffect } from "react";
import { useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { useAuthStore } from "@/stores/useAuthStore";

function buildReturnTo(pathname: string, params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const { isAuthenticated, authLoading } = useAuthStore();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace({
        pathname: "/(auth)/login",
        params: { returnTo: buildReturnTo(pathname, params) },
      });
    }
  }, [isAuthenticated, authLoading, params, pathname, router]);

  return { isAuthenticated, authLoading };
}
