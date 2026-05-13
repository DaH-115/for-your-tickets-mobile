import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { useAlertStore } from "@/stores/useAlertStore";
import { COLORS } from "@/constants/theme";

export default function Toast() {
  const { toast, hideToast } = useAlertStore();
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (!toast) return;

    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) hideToast();
    });
  }, [toast, hideToast, translateY]);

  if (!toast) return null;

  const bgColor = {
    success: COLORS.success,
    error: COLORS.error,
    info: COLORS.accent,
  }[toast.type];

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        backgroundColor: bgColor,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: "600",
          color: "#fff",
        }}
      >
        {toast.message}
      </Text>
    </Animated.View>
  );
}
