// stores/garden-store.ts
import { create } from "zustand";

interface GardenStore {
  selectedGardenId: string;
  setSelectedGardenId: (id: string) => void;
}

export const useGardenStore = create<GardenStore>((set) => ({
  selectedGardenId: "",
  setSelectedGardenId: (id) => set({ selectedGardenId: id }),
}));
