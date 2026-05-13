import { create } from "zustand";
import type { ReviewDoc } from "@/types/review";
import { ticketCache } from "@/services/offline/ticketCache";

interface OfflineState {
  isOffline: boolean;
  cachedTickets: ReviewDoc[] | null;
  lastSyncTime: string | null;
  setOffline: (offline: boolean) => void;
  loadCachedTickets: (uid: string) => void;
  updateCache: (uid: string, reviews: ReviewDoc[]) => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOffline: false,
  cachedTickets: null,
  lastSyncTime: null,

  setOffline: (offline) => set({ isOffline: offline }),

  loadCachedTickets: (uid) => {
    const tickets = ticketCache.getMyTickets(uid);
    const lastSync = ticketCache.getLastSync(uid);
    set({ cachedTickets: tickets, lastSyncTime: lastSync });
  },

  updateCache: (uid, reviews) => {
    ticketCache.saveMyTickets(uid, reviews);
    set({
      cachedTickets: reviews,
      lastSyncTime: new Date().toISOString(),
    });
  },
}));
