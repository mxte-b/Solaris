import Star from "./Star";
import { Mesh, Vector2, Vector3 } from "three";
import Planet from "./Planet";
import { createRef, Fragment, Suspense, useMemo, useRef, type RefObject } from "react";
import { useGlobals } from "../ts/globals";
import Orbit from "./Orbit";
import { useFrame, useThree } from "@react-three/fiber";

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
 */
type SolarSystemProps = {
    system: SolarSystemData;
    planetPositionsRef: RefObject<Map<number, Vector2>>;
};

/**
 * SolarSystem component renders all celestial bodies (stars and planets) in the system.
 * Applies scaling for distances and radii based on global state.
 */
const SolarSystem = ({ system , planetPositionsRef} : SolarSystemProps) => {
    const DISTANCE_SCALE = useGlobals(state => state.distanceScale);
    const RADIUS_SCALE = useGlobals(state => state.planetScale);

    const logScaled = (x: number) => Math.max(Math.log(x + 1) * RADIUS_SCALE, 0.5); 

    const planetMeshRefs = useRef<Map<number, RefObject<Mesh | null>>>(
        new Map(system.bodies.map(b => [b.id, createRef<Mesh>()]))
    );

    const prevPositions = useRef<Map<number, Vector2>>(new Map());

    // Project world positions to screen space each frame with linear extrapolation
    const { camera, size } = useThree();
    useFrame(() => {
        planetMeshRefs.current.forEach((ref, id) => {
            const mesh = ref.current;
            if (!mesh) return;

            const ndc = mesh.getWorldPosition(new Vector3()).project(camera);
            const ssc = new Vector2(
                (ndc.x + 1) * size.width / 2,
                (1 - (ndc.y + 1) / 2) * size.height
            );

        
            const center = new Vector2(size.width / 2, size.height / 2);
            const centerDistance = Math.min(center.clone().sub(ssc).length(), 1);

            const last = prevPositions.current.get(id) || ssc;
            const diff = ssc.clone().sub(last);
            const predicted = ssc.clone().add(diff.multiplyScalar(1.5));
            
            planetPositionsRef.current.set(id, predicted);

            prevPositions.current.set(id, ssc);
        });
    });

    return (
		<Suspense fallback={null}>
			{system.bodies.map(b => {
				const ref = planetMeshRefs.current.get(b.id)!;

				return b.type === "Star" ? (
					<Star
						key={b.id}
						positionRef={ref}
						radius={logScaled(b.radius)}
						position={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE)}
						color={b.visual.color}
						texturePath={b.visual.texture}
					/>
				) : (
					<Fragment key={b.id}>
						<Planet
							positionRef={ref}
							name={b.name}
							id={b.id}
							radius={logScaled(b.radius)}
							position={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE)}
							color="white"
							texturePath={b.visual.texture}
						/>
						<Orbit
							key={b.id + "-orbit"}
							center={new Vector3(0, 0, 0)}
							color="#B57F12"
							radius={system.orbits.find(o => o.id === b.id)!.radius}
						/>
					</Fragment>
				);
			})}
		</Suspense>
	);
}

export default SolarSystem;