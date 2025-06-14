import { create } from "zustand";

export const useGlobals = create(set => ({
    selectedPlanet: null,
    setSelectedPlanet: (planet : Object) => set({ selectedPlanet: planet }),
    planetPositions: null
}));