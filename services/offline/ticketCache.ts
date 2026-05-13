import { createMMKV } from "react-native-mmkv";
import type { ReviewDoc } from "@/types/review";

const storage = createMMKV({ id: "ticket-cache" });

const KEYS = {
  myTickets: (uid: string) => `my-tickets-${uid}`,
  lastSync: (uid: string) => `last-sync-${uid}`,
};

export const ticketCache = {
  saveMyTickets: (uid: string, reviews: ReviewDoc[]) => {
    storage.set(KEYS.myTickets(uid), JSON.stringify(reviews));
    storage.set(KEYS.lastSync(uid), new Date().toISOString());
  },

  getMyTickets: (uid: string): ReviewDoc[] | null => {
    const data = storage.getString(KEYS.myTickets(uid));
    if (!data) return null;
    try {
      return JSON.parse(data) as ReviewDoc[];
    } catch {
      return null;
    }
  },

  getLastSync: (uid: string): string | null => {
    return storage.getString(KEYS.lastSync(uid)) || null;
  },

  clearCache: (uid: string) => {
    storage.remove(KEYS.myTickets(uid));
    storage.remove(KEYS.lastSync(uid));
  },

  clearAll: () => {
    storage.clearAll();
  },
};
