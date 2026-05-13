import { Tabs } from "expo-router";
import FloatingTabBar from "@/components/ui/FloatingTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "홈" }} />
      <Tabs.Screen name="search" options={{ title: "검색" }} />
      <Tabs.Screen name="ticket-list" options={{ title: "티켓" }} />
      <Tabs.Screen name="my-page" options={{ title: "마이" }} />
    </Tabs>
  );
}
