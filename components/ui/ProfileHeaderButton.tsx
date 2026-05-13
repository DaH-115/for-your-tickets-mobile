import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import Avatar from "@/components/ui/Avatar";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { useAuthStore } from "@/stores/useAuthStore";
import { COLORS } from "@/constants/theme";

const PROFILE_BUTTON_SIZE = 36;

export default function ProfileHeaderButton() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const photoUrl = usePhotoUrl(user?.photoKey, user?.photoUrl);

  if (!isAuthenticated || !user) {
    return (
      <Pressable
        onPress={() => router.push("/(auth)/login")}
        accessibilityRole="button"
        accessibilityLabel="로그인 화면으로 이동"
        className="items-center justify-center rounded-full px-4"
        style={({ pressed }) => ({
          height: 36,
          opacity: pressed ? 0.75 : 1,
          borderWidth: 1,
          borderColor: COLORS.border,
        })}
      >
        <Text className="text-base font-bold text-white">로그인</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push("/(tabs)/my-page")}
      accessibilityRole="button"
      accessibilityLabel="마이페이지로 이동"
      className="items-center justify-center rounded-full"
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        opacity: pressed ? 0.75 : 1,
        borderWidth: 1,
        borderColor: COLORS.border,
      })}
    >
      <Avatar
        photoUrl={photoUrl}
        displayName={user?.displayName}
        size={PROFILE_BUTTON_SIZE}
      />
    </Pressable>
  );
}
