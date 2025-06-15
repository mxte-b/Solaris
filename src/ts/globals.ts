import { create } from "zustand";

type GlobalValues = {
    selectedPlanet: number | null;
    setSelectedPlanet: (planet: number) => void;
    planetPositions: number[] | null;
    distanceScale: number;
    setDistanceScale: (scale: number) => void;
    planetScale: number;
    setPlanetScale: (scale : number) => void;
}

export const useGlobals = create<GlobalValues>(set => ({
    selectedPlanet: null,
    setSelectedPlanet: (planet : number) => set({ selectedPlanet: planet }),

    planetPositions: null,

    distanceScale: 2,
    setDistanceScale: (scale : number) => set({ distanceScale: scale }),

    planetScale: 10,
    setPlanetScale: (scale : number) => set({ planetScale: scale }),
}));