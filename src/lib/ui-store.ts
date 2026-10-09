import { create } from "zustand";

/** Ephemeral shell state (never persisted). */
interface UiState {
  searchOpen: boolean;
  tokenModalOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setTokenModalOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  tokenModalOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setTokenModalOpen: (tokenModalOpen) => set({ tokenModalOpen }),
}));
