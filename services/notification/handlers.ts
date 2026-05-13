import * as Notifications from "expo-notifications";
import { router } from "expo-router";

export function setupNotificationListeners() {
  // 알림 탭 시 딥링크 처리
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      if (data?.type === "review" && data?.reviewId) {
        router.push(`/review/${data.reviewId}`);
      } else if (data?.type === "movie" && data?.movieId) {
        router.push(`/movie/${data.movieId}`);
      }
    });

  // 포그라운드에서 알림 수신
  const notificationSubscription =
    Notifications.addNotificationReceivedListener((notification) => {
      // 포그라운드 알림 수신 시 처리 (필요 시 인앱 알림 표시)
    });

  return () => {
    responseSubscription.remove();
    notificationSubscription.remove();
  };
}
