import { Pressable, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Avatar from "@/components/ui/Avatar";
import { usePhotoUrl } from "@/hooks/usePhotoUrl";
import { formatDate } from "@/utils/formatDate";
import { COLORS } from "@/constants/theme";
import type { ReviewDoc } from "@/types/review";

interface ReviewCardProps {
  review: ReviewDoc;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const router = useRouter();
  const { user, review: r, orderNumber } = review;
  const photoUrl = usePhotoUrl(user.photoKey);

  return (
    <Pressable
      onPress={() => router.push(`/review/${review.id}`)}
      className="mx-auto mb-3 w-full"
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
    >
      <View className="rounded-2xl bg-white px-6 py-5">
        {/* 상단: 영화 제목 + 원제(년도) | No.{orderNumber} */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1 pr-2">
            <Text
              className="text-lg font-bold text-gray-900"
              numberOfLines={1}
            >
              {r.movieTitle}
            </Text>
            <Text
              className="mt-0.5 text-sm tracking-tight text-gray-400"
              numberOfLines={1}
            >
              {r.originalTitle}
              {r.releaseYear ? ` (${r.releaseYear})` : ""}
            </Text>
          </View>

          {typeof orderNumber === "number" && (
            <View className="bg-gray-200 px-2 py-1">
              <Text className="text-xs font-bold tracking-tight text-gray-600">
                No.{orderNumber}
              </Text>
            </View>
          )}
        </View>

        {/* 유저 */}
        <View className="flex-row items-center">
          <Avatar
            photoUrl={photoUrl}
            displayName={user.displayName}
            size={32}
          />
          <Text className="ml-2 text-base font-semibold tracking-tight text-gray-800">
            {user.displayName || ""}
          </Text>
        </View>

        {/* 리뷰 타이틀 */}
        <Text
          className="pt-6 pb-8 text-xl font-semibold tracking-tight text-gray-900"
          numberOfLines={2}
        >
          &quot;{r.reviewTitle}&quot;
        </Text>

        {/* 하단: 날짜 ↔ 별+평점 */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm tracking-tight text-gray-400">
            {formatDate(r.createdAt)}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={18} color={COLORS.accent} />
            <Text className="ml-1 text-lg font-bold text-gray-900">
              {r.rating}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
