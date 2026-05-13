import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { registerForPushNotifications } from "@/services/notification/setup";
import { setupNotificationListeners } from "@/services/notification/handlers";
import Toast from "@/components/ui/Toast";
import { COLORS } from "@/constants/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function AuthListener() {
  const initAuthListener = useAuthStore((s) => s.initAuthListener);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return unsubscribe;
  }, [initAuthListener]);

  return null;
}

function NotificationSetup() {
  const setPushToken = useNotificationStore((s) => s.setPushToken);
  const setEnabled = useNotificationStore((s) => s.setNotificationsEnabled);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        setPushToken(token);
        setEnabled(true);
      }
    });

    const cleanup = setupNotificationListeners();
    return cleanup;
  }, [setPushToken, setEnabled]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      <NotificationSetup />
      <StatusBar style="light" />
      <Toast />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="movie/[id]"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="review/[reviewId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="review/write/new"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="review/write/[reviewId]"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
