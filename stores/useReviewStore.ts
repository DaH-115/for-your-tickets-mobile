import { create } from "zustand";

interface ReviewStoreState {
  searchQuery: string;
  sortOrder: "latest" | "popular";
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: "latest" | "popular") => void;
}

export const useReviewStore = create<ReviewStoreState>((set) => ({
  searchQuery: "",
  sortOrder: "latest",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortOrder: (order) => set({ sortOrder: order }),
}));
