import Star from "./Star";
import { Vector2, Vector3 } from "three";
import Planet from "./Planet";
import { Fragment, Suspense} from "react";
import { useGlobals, type RefPair, type SolarSystemProps } from "../ts/globals";
import Orbit from "./Orbit";
import { useFrame, useThree } from "@react-three/fiber";
import Helpers from "./Helpers";

const tmpWorld = new Vector3()
const tmpSSC = new Vector2()
const tmpCam = new Vector3()


/**
 * SolarSystem component renders all celestial bodies (stars and planets) in the system.
 * Applies scaling for distances and radii based on global state.
 */
const SolarSystem = ({ system , pairsRef} : SolarSystemProps) => {
    const DISTANCE_SCALE = useGlobals(state => state.distanceScale);
    const RADIUS_SCALE = useGlobals(state => state.planetScale);
    const { camera, size } = useThree();

    const logScaled = (x: number) => Math.min(Math.max(Math.log(x + 1) * RADIUS_SCALE, 0.2), 10); 

    // Project world positions to screen space each frame with linear extrapolation
    useFrame(() => {
        const camInv = camera.matrixWorldInverse

        pairsRef.current.forEach(({ meshRef, domRef }) => {
            const mesh = meshRef.current;
            const div = domRef.current;

            if (!mesh || !div) return;

            mesh.getWorldPosition(tmpWorld);

            tmpCam.copy(tmpWorld).applyMatrix4(camInv);

            if (tmpCam.z > 0) {
                div.style.display = "none";
                return;
            }

            tmpWorld.project(camera);
            tmpSSC.set(
                (tmpWorld.x + 1) * size.width / 2,
                (1 - (tmpWorld.y + 1) / 2) * size.height
            );

            if (tmpSSC.x < -20 || tmpSSC.x > screen.width || tmpSSC.y < -20 || tmpSSC.y > screen.height) {
                div.style.display = "none";
                return;
            }

            if (div.style.display == "none") {
                div.style.display = "block";
            }

            div.style.transform = `translate3d(${tmpSSC.x - 20}px, ${tmpSSC.y - 20}px, 0)`;
        });
    });

    let refIndex = 0;

    return (
		<Suspense fallback={null}>
			{system.bodies.map((b, i) => {
				const { meshRef, domRef } = pairsRef.current[refIndex++];

                const common = {
                    positionRef: meshRef,
                    radius: logScaled(Helpers.ER2LS(b.radius)),
                    position: new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE),
                    texturePath: b.visual.texture,
                }

				return (
                    <Fragment key={b.id}>
                        { b.type === "Star"
                        ?
                            <Star {...common} color={b.visual.color} />
                        :
                            <>
                                <Planet {...common} color="white" name={b.name} id={b.id} />
                                <Orbit
                                center={new Vector3(0, 0, 0)}
                                color="#B57F12"
                                radius={system.orbits.find(o => o.id === b.id)!.radius}
                                />

                                {/* Rendering the moons*/}
                                {b.moons?.map((m, mi) => {
                                    const { meshRef, domRef } = pairsRef.current[refIndex++];

                                    return (
                                        <Fragment key={mi+"-moon"}>
                                            <Planet 
                                                color="white"
                                                name={m.name}
                                                id={m.id}
                                                positionRef={meshRef} 
                                                radius={logScaled(Helpers.ER2LS(m.radius))}
                                                position={new Vector3(0, 0, (b.distanceLS + m.planetDistanceLS * RADIUS_SCALE) / DISTANCE_SCALE )}
                                                texturePath={m.visual.texture}
                                            />
                                            <Orbit
                                            center={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE * 2)}
                                            color="#B57F12"
                                            radius={system.orbits.find(o => o.id === m.id)!.radius * RADIUS_SCALE }
                                            />
                                        </Fragment>
                                    )
                                })}
                            </>
                        }
                    </Fragment>
				);
			})}
		</Suspense>
	);
}

export default SolarSystem;