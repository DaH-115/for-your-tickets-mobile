import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/types/user";
import {
  subscribeToAuthState,
  getAuthHeaders,
} from "@/services/firebase/auth";
import { API_BASE_URL } from "@/utils/constants";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthenticated: boolean;
  authLoading: boolean;
}

interface AuthActions {
  initAuthListener: () => () => void;
  setAuthState: (firebaseUser: FirebaseUser | null) => void;
  fetchUserProfile: (uid: string) => Promise<void>;
  updateUserProfile: (
    uid: string,
    data: { displayName?: string; biography?: string; photoKey?: string }
  ) => Promise<void>;
  updateActivityLevel: (level: string) => void;
  clearUser: () => void;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  authLoading: true,
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  initAuthListener: () => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        get().setAuthState(firebaseUser);
        await get().fetchUserProfile(firebaseUser.uid);
      } else {
        get().clearUser();
      }
    });
    return unsubscribe;
  },

  setAuthState: (firebaseUser) => {
    if (firebaseUser) {
      const basicUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoKey: null,
        photoUrl: firebaseUser.photoURL,
        biography: null,
        provider: firebaseUser.providerData[0]?.providerId || null,
        activityLevel: "NEWBIE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        myTicketsCount: 0,
        likedTicketsCount: 0,
      };
      set({
        user: basicUser,
        isAuthenticated: true,
        authLoading: false,
        status: "succeeded",
        error: null,
      });
    } else {
      set({ ...initialState, authLoading: false });
    }
  },

  fetchUserProfile: async (uid) => {
    try {
      set({ status: "loading", error: null });
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/users/${uid}`, {
        headers: { ...headers, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("프로필 조회 실패");

      const profile: User = await response.json();
      set((state) => ({
        status: "succeeded",
        user: state.user ? { ...state.user, ...profile } : profile,
        error: null,
      }));
    } catch (error) {
      set({
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "프로필 조회에 실패했습니다.",
      });
    }
  },

  updateUserProfile: async (uid, data) => {
    try {
      set({ status: "loading", error: null });
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/users/${uid}`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("프로필 업데이트 실패");

      const result = await response.json();
      set((state) => ({
        status: "succeeded",
        user: state.user
          ? {
              ...state.user,
              ...data,
              ...(result.biography !== undefined && {
                biography: result.biography,
              }),
              ...(result.photoKey !== undefined && {
                photoKey: result.photoKey,
              }),
              updatedAt: new Date().toISOString(),
            }
          : null,
        error: null,
      }));
    } catch (error) {
      set({
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "프로필 업데이트에 실패했습니다.",
      });
    }
  },

  updateActivityLevel: (level) => {
    set((state) => ({
      user: state.user ? { ...state.user, activityLevel: level } : null,
    }));
  },

  clearUser: () => {
    set({ ...initialState, authLoading: false });
  },
}));
