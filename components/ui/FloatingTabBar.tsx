import { View, Pressable, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { COLORS } from "@/constants/theme";

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home",
  search: "search",
  "ticket-list": "ticket",
  "my-page": "person",
};

export default function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom, 12),
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(26,26,26,0.95)",
          borderRadius: 32,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderWidth: 0.5,
          borderColor: "rgba(255,255,255,0.08)",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
            },
            android: {
              elevation: 12,
            },
          }),
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            typeof options.title === "string" ? options.title : route.name;
          const iconName = ICONS[route.name] ?? "ellipse";
          const color = isFocused ? COLORS.accent : COLORS.textMuted;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                alignItems: "center",
                justifyContent: "center",
                minWidth: 56,
                minHeight: 44,
              }}
            >
              <Ionicons name={iconName} size={22} color={color} />
              {isFocused && (
                <Text
                  style={{
                    color,
                    fontSize: 11,
                    fontWeight: "700",
                    marginTop: 2,
                  }}
                >
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
