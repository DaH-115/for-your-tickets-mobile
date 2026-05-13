import { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Avatar from "@/components/ui/Avatar";
import ActivityBadge from "@/components/ui/ActivityBadge";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAlertStore } from "@/stores/useAlertStore";
import { signOut } from "@/services/firebase/auth";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { COLORS } from "@/constants/theme";

export default function MyPageScreen() {
  const router = useRouter();
  const { user, isAuthenticated, fetchUserProfile } = useAuthStore();
  const showToast = useAlertStore((s) => s.showToast);
  const photoUrl = usePhotoUrl(user?.photoKey, user?.photoUrl);

  // 탭 포커스마다 user profile 재동기화 (count / activityLevel 최신화)
  useFocusEffect(
    useCallback(() => {
      if (user?.uid) fetchUserProfile(user.uid);
    }, [user?.uid, fetchUserProfile])
  );

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons
            name="person-circle-outline"
            size={64}
            color={COLORS.textMuted}
          />
          <Text className="mt-4 text-lg font-bold text-text-primary">
            로그인이 필요합니다
          </Text>
          <Text className="mt-1 text-base text-text-secondary">
            로그인하고 나만의 티켓을 관리해보세요
          </Text>
          <Button
            title="로그인"
            onPress={() => router.push("/(auth)/login")}
            className="mt-6"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
      showToast("로그아웃되었습니다.", "success");
    } catch {
      showToast("로그아웃에 실패했습니다.", "error");
    }
  };

  const menuItems = [
    {
      icon: "ticket-outline" as const,
      label: "내 티켓",
      count: user.myTicketsCount,
      route: "/(tabs)/my-page/my-tickets",
    },
    {
      icon: "heart-outline" as const,
      label: "좋아요한 티켓",
      count: user.likedTicketsCount,
      route: "/(tabs)/my-page/liked-tickets",
    },
    {
      icon: "create-outline" as const,
      label: "프로필 편집",
      route: "/(tabs)/my-page/edit-profile",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-6 text-xl font-bold text-text-primary">
          마이페이지
        </Text>

        {/* Profile Card */}
        <View className="rounded-2xl bg-surface p-6">
          <View className="flex-row items-center">
            <Avatar
              photoUrl={photoUrl}
              displayName={user.displayName}
              size={72}
            />
            <View className="ml-4 flex-1">
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-text-primary">
                  {user.displayName}
                </Text>
                <View className="ml-2">
                  <ActivityBadge level={user.activityLevel} />
                </View>
              </View>
              <Text className="mt-0.5 text-xs text-text-muted">
                {user.email}
              </Text>
              {user.biography && (
                <Text
                  className="mt-2 text-base text-text-secondary"
                  numberOfLines={2}
                >
                  {user.biography}
                </Text>
              )}
            </View>
          </View>

          {/* Stats */}
          <View className="mt-4 flex-row justify-around rounded-xl bg-surface-light p-3">
            <View className="items-center">
              <Text className="text-lg font-bold text-accent">
                {user.myTicketsCount}
              </Text>
              <Text className="text-xs text-text-muted">내 티켓</Text>
            </View>
            <View className="h-8 w-px bg-gray-600" />
            <View className="items-center">
              <Text className="text-lg font-bold text-accent">
                {user.likedTicketsCount}
              </Text>
              <Text className="text-xs text-text-muted">좋아요</Text>
            </View>
            <View className="h-8 w-px bg-gray-600" />
            <View className="items-center">
              <Text className="text-lg font-bold text-accent">
                {user.activityLevel}
              </Text>
              <Text className="text-xs text-text-muted">등급</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="mt-6">
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as never)}
              className="mb-2 flex-row items-center justify-between rounded-xl bg-surface p-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={COLORS.textSecondary}
                />
                <Text className="ml-3 text-base text-text-primary">
                  {item.label}
                </Text>
              </View>
              <View className="flex-row items-center">
                {item.count !== undefined && (
                  <Text className="mr-2 text-sm text-accent">{item.count}</Text>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={COLORS.textMuted}
                />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Button
          title="로그아웃"
          onPress={handleLogout}
          variant="outline"
          className="mt-6"
        />
      </View>
    </SafeAreaView>
  );
}
