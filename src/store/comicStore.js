import { create } from "zustand";

const useComicStore = create((set) => ({
  comics: [],
  setComics: (comics) => set({ comics }), 
}));

export default useComicStore;
