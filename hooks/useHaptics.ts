import * as Haptics from "expo-haptics";

export function useHaptics() {
  const triggerLike = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  const triggerSelection = () => Haptics.selectionAsync();

  const triggerWarning = () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

  const triggerSuccess = () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  const triggerLight = () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  return {
    triggerLike,
    triggerSelection,
    triggerWarning,
    triggerSuccess,
    triggerLight,
  };
}
