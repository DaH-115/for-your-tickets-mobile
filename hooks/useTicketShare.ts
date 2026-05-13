import { useRef } from "react";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import { useAlertStore } from "@/stores/useAlertStore";
import { useHaptics } from "@/hooks/useHaptics";

export function useTicketShare() {
  const viewShotRef = useRef<ViewShot>(null);
  const showToast = useAlertStore((s) => s.showToast);
  const { triggerSuccess } = useHaptics();

  const captureAndShare = async () => {
    try {
      if (!viewShotRef.current?.capture) {
        showToast("공유 준비에 실패했습니다.", "error");
        return;
      }

      const uri = await viewShotRef.current.capture();

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showToast("이 기기에서는 공유를 사용할 수 없습니다.", "error");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "티켓 공유하기",
      });

      triggerSuccess();
    } catch {
      showToast("공유에 실패했습니다.", "error");
    }
  };

  return { viewShotRef, captureAndShare };
}
