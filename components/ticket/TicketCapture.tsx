import { forwardRef } from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";

import { getTmdbPosterUrl } from "@/utils/imageUrl";
import { formatDate } from "@/utils/formatDate";
import { COLORS } from "@/constants/theme";
import type { ReviewDoc } from "@/types/review";

interface TicketCaptureProps {
  review: ReviewDoc;
}

const TicketCapture = forwardRef<ViewShot, TicketCaptureProps>(
  ({ review }, ref) => {
    const posterUrl = getTmdbPosterUrl(review.review.moviePosterPath);

    return (
      <ViewShot ref={ref} options={{ format: "png", quality: 1 }}>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: COLORS.accent,
          }}
        >
          {/* Ticket Header */}
          <View
            style={{
              backgroundColor: COLORS.primary,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="ticket" size={18} color={COLORS.accent} />
              <Text
                style={{
                  color: COLORS.accent,
                  fontWeight: "bold",
                  fontSize: 14,
                  marginLeft: 6,
                }}
              >
                For Your Tickets
              </Text>
            </View>
            {review.orderNumber && (
              <Text style={{ color: "#ffffff80", fontSize: 11 }}>
                No.{review.orderNumber}
              </Text>
            )}
          </View>

          {/* Content */}
          <View style={{ padding: 16, flexDirection: "row" }}>
            {posterUrl && (
              <Image
                source={{ uri: posterUrl }}
                style={{ width: 80, height: 120, borderRadius: 8 }}
                contentFit="cover"
              />
            )}
            <View style={{ flex: 1, marginLeft: posterUrl ? 12 : 0 }}>
              <Text
                style={{
                  color: COLORS.textPrimary,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
                numberOfLines={2}
              >
                {review.review.reviewTitle}
              </Text>
              <Text
                style={{
                  color: COLORS.textMuted,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {review.review.movieTitle} ({review.review.releaseYear})
              </Text>

              {/* Stars */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < review.review.rating ? "star" : "star-outline"}
                    size={14}
                    color={COLORS.accent}
                  />
                ))}
              </View>

              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: 12,
                  marginTop: 8,
                  lineHeight: 18,
                }}
                numberOfLines={3}
              >
                {review.review.reviewContent}
              </Text>
            </View>
          </View>

          {/* Ticket Footer - Dashed Line + Info */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.border,
              borderStyle: "dashed",
              paddingVertical: 10,
              paddingHorizontal: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: COLORS.textMuted, fontSize: 11 }}>
              by {review.user.displayName}
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 11 }}>
              {formatDate(review.review.createdAt)}
            </Text>
          </View>
        </View>
      </ViewShot>
    );
  }
);

TicketCapture.displayName = "TicketCapture";

export default TicketCapture;
