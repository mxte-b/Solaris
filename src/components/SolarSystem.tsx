import Star from "./Star";
import { Vector3 } from "three";
import Planet from "./Planet";
import { Fragment, Suspense, useMemo } from "react";
import { useGlobals } from "../ts/globals";
import Orbit from "./Orbit";

/**
 * Visual appearance properties for a celestial body.
 */
type Visual = {
  texture: string;
  color: string;
};

/**
 * Data structure for a moon orbiting a planet.
 */
type Moon = {
  name: string;
  id: number;
  type: string;
  planetDistanceLS: number;
};

/**
 * Data structure for a celestial body (planet or star).
 */
type CelestialBody = {
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
type OrbitalData = {
  id: number;
  radius: number;
  offset: number;
  speed: number;
};

/**
 * Data structure for the solar system.
 */
type SolarSystemData = {
  name: string;
  orbits: OrbitalData[];
  bodies: CelestialBody[];
};

/**
 * Props for the SolarSystem component.
 * @property data - The solar system data to render.
 */
type SolarSystemProps = {
  system: SolarSystemData;
};

/**
 * SolarSystem component renders all celestial bodies (stars and planets) in the system.
 * Applies scaling for distances and radii based on global state.
 */
const SolarSystem = ({ system } : SolarSystemProps) => {
    const DISTANCE_SCALE = useGlobals(state => state.distanceScale);
    const RADIUS_SCALE = useGlobals(state => state.planetScale);

    const logScaled = (x: number) => Math.max(Math.log(x + 1) * RADIUS_SCALE, 0.5); 

    return (
        <Suspense fallback={null}>
            {system.bodies.map((b, i) => 
                b.type == "Star" 
                ? <Star key={i} radius={logScaled(b.radius)} position={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE)} color={b.visual.color} texturePath={b.visual.texture}/> 
                : <Fragment key={"f"+i}>
                    <Planet key={"p"+i} radius={logScaled(b.radius)} position={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE)} color="white" texturePath={b.visual.texture}/>
                    <Orbit key={"o"+i} center={new Vector3(0, 0, 0)} color="#e5a018" radius={system.orbits.find(x => x.id == b.id)!.radius} />
                  </Fragment>
            )}
        </Suspense>
    );
}

export default SolarSystem;