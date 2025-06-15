import { create } from "zustand";

type GlobalValues = {
    selectedPlanet: number | null;
    setSelectedPlanet: (planet: number) => void;
    
    distanceScale: number;
    setDistanceScale: (scale: number) => void;

    planetScale: number;
    setPlanetScale: (scale : number) => void;
}

export const useGlobals = create<GlobalValues>(set => ({
    selectedPlanet: null,
    setSelectedPlanet: (planet : number) => set({ selectedPlanet: planet }),

    distanceScale: 2,
    setDistanceScale: (scale : number) => set({ distanceScale: scale }),

    planetScale: 10,
    setPlanetScale: (scale : number) => set({ planetScale: scale }),
}));