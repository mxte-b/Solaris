import type { RefObject } from "react";
import type { Mesh } from "three";
import { create } from "zustand";

/* ----------------------------- Zustand stores ----------------------------- */
type GlobalValues = {
    selectedPlanet: RefPair | null;
    setSelectedPlanet: (planet: RefPair) => void;

    isTravelling: boolean;
    setIsTravelling: (value: boolean) => void;

    travelStatus: TravelStatus | null;
    setTravelStatus: (status: TravelStatus) => void;
    
    distanceScale: number;
    setDistanceScale: (scale: number) => void;

    planetScale: number;
    setPlanetScale: (scale : number) => void;
}

export const useGlobals = create<GlobalValues>(set => ({
    selectedPlanet: null,
    setSelectedPlanet: (planet : RefPair) => set({ selectedPlanet: planet }),

    isTravelling: false,
    setIsTravelling: (value: boolean) => set({ isTravelling: value }),

    travelStatus: null,
    setTravelStatus: (status: TravelStatus) => set({ travelStatus: status }),

    distanceScale: 5,
    setDistanceScale: (scale : number) => set({ distanceScale: scale }),

    planetScale: 100,
    setPlanetScale: (scale : number) => set({ planetScale: scale }),
}));

/* ---------------------------- Type definitions ---------------------------- */

export type RefPair = {
    id: number;
    name: string;
    meshRef: RefObject<Mesh | null>
    domRef: RefObject<HTMLDivElement | null>
}

/**
 * Visual appearance properties for a celestial body.
 */
export type Visual = {
    texture: string;
    color: string;
};

/**
 * Data structure for a moon orbiting a planet.
 */
export type Moon = {
    name: string;
    id: number;
    type: string;
    planetDistanceLS: number;
    radius: number;
    visual: Visual;
};

/**
 * Data structure for a celestial body (planet or star).
 */
export type CelestialBody = {
    name: string;
    id: number;
    type: string;
    distanceLS: number;
    radius: number;
    visual: Visual;
    moons?: Moon[];
};

/**
 * Data structure for an orbit.
 */
export type OrbitalData = {
    id: number;
    radius: number;
    offset: number;
    speed: number;
};

/**
 * Data structure for the solar system.
 */
export type SolarSystemData = {
    name: string;
    orbits: OrbitalData[];
    bodies: CelestialBody[];
};

/**
 * Props for the SolarSystem component.
 */
export type SolarSystemProps = {
    system: SolarSystemData;
    pairsRef: RefObject<RefPair[]>;
};

/**
 * Props for the handling of pointer events
 */
export type PointerEvents = {
    onPointerEnter?: (e: PointerEvent) => void;
    onPointerOut?: (e: PointerEvent) => void;
    onPointerDown?: (e: PointerEvent) => void;
    onPointerUp?: (e: PointerEvent) => void;
    onClick?: (e: PointerEvent) => void;
}

/**
 * Easing types for the Animator class
 */
export type Easing = "linear" | "easeIn" | "easeOut" | "easeInOut" | "easeInOutCubic";

/**
 * Data structure for travel status
 */
export type TravelStatus = {
    destination: string;
    travelDuration: number;
}