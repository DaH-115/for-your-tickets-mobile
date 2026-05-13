import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-6xl font-bold text-primary">404</Text>
        <Text className="mt-4 text-xl text-text-primary">
          페이지를 찾을 수 없습니다
        </Text>
        <Pressable
          onPress={() => router.replace("/(tabs)/home")}
          className="mt-8 rounded-lg bg-primary px-8 py-3"
        >
          <Text className="text-base font-bold text-white">홈으로 이동</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
