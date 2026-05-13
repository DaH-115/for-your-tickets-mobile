import { create } from "zustand";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

interface AlertStoreState {
  toast: ToastState | null;
  levelUpModal: { isOpen: boolean; level: string };
  showToast: (message: string, type?: ToastState["type"]) => void;
  hideToast: () => void;
  showLevelUpModal: (level: string) => void;
  hideLevelUpModal: () => void;
}

export const useAlertStore = create<AlertStoreState>((set) => ({
  toast: null,
  levelUpModal: { isOpen: false, level: "" },

  showToast: (message, type = "info") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null }),

  showLevelUpModal: (level) =>
    set({ levelUpModal: { isOpen: true, level } }),

  hideLevelUpModal: () =>
    set({ levelUpModal: { isOpen: false, level: "" } }),
}));
