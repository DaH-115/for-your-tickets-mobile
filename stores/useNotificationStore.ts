import { create } from "zustand";

interface NotificationState {
  pushToken: string | null;
  notificationsEnabled: boolean;
  setPushToken: (token: string | null) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  pushToken: null,
  notificationsEnabled: false,
  setPushToken: (token) => set({ pushToken: token }),
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));
