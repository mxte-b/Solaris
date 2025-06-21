import Star from "./Star";
import Orbit from "./Orbit";
import Planet from "./Planet";
import Helpers from "../ts/Helpers";
import { Vector2, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Fragment, Suspense} from "react";
import { useGlobals, type PointerEvents, type SolarSystemProps } from "../ts/globals";

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

    // Setters
    const selectedPlanet = useGlobals(state => state.selectedPlanet);
    const setSelectedPlanet = useGlobals(state => state.setSelectedPlanet);

    // Project world positions to screen space each frame with linear extrapolation
    useFrame(() => {
        const camInv = camera.matrixWorldInverse

        pairsRef.current.forEach(({ id, meshRef, domRef }) => {
            const mesh = meshRef.current;
            const div = domRef.current;

            if (!mesh || !div) return;

            // Updating indicator positions
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

            // Hiding moon indicators when necessary
            if (id < 100) return;

            const parent = pairsRef.current.find(x => x.id == Math.floor(id / 100))
            const parentMesh = parent?.meshRef.current;

            if (!parentMesh || !parent) return;

            const dist = camera.position.distanceTo(parentMesh.position) / parentMesh.geometry.boundingSphere!.radius;

            // Hide the indicator if it's not the selected moon or irrelevant due to distance or parent mismatch
            const isNotSelected = selectedPlanet?.id !== id;
            const isTooFar = dist > 50;

            const hasDifferentParent = selectedPlanet && (
                (selectedPlanet.id > 100 ? Math.floor(selectedPlanet.id / 100) : selectedPlanet.id) !== parent.id
            );

            if (isNotSelected && (isTooFar || hasDifferentParent)) {
                div.style.opacity = "0";
            } else {
                div.style.opacity = "1";
            }
        });
    }, 2);

    let refIndex = 0;

    return (
		<Suspense fallback={null}>
			{system.bodies.map((b, i) => {
				const planetRef = pairsRef.current[refIndex++];
                const { meshRef, domRef } = planetRef;

                const eventHandler : PointerEvents = {
                    onPointerEnter: Helpers.CreateHoverHandler(domRef, "add"),
                    onPointerOut: Helpers.CreateHoverHandler(domRef, "remove"),
                    onPointerDown: Helpers.CreateActiveHandler(domRef, "add"),
                    onPointerUp: Helpers.CreateActiveHandler(domRef, "remove"),
                    onClick: Helpers.CreateClickHandler(planetRef, setSelectedPlanet)
                }

                const common = {
                    meshRef: meshRef,
                    radius: logScaled(Helpers.ER2LS(b.radius)),
                    position: new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE),
                    texturePath: b.visual.texture,
                    pointerEvents: eventHandler
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
                                    const planetRef = pairsRef.current[refIndex++];
                                    const { meshRef, domRef } = planetRef;

                                    const eventHandler : PointerEvents = {
                                        onPointerEnter: Helpers.CreateHoverHandler(domRef, "add"),
                                        onPointerOut: Helpers.CreateHoverHandler(domRef, "remove"),
                                        onPointerDown: Helpers.CreateActiveHandler(domRef, "add"),
                                        onPointerUp: Helpers.CreateActiveHandler(domRef, "remove"),
                                        onClick: Helpers.CreateClickHandler(planetRef, setSelectedPlanet)
                                    }

                                    return (
                                        <Fragment key={mi+"-moon"}>
                                            <Planet 
                                                id={m.id}
                                                name={m.name}
                                                color="white"
                                                meshRef={meshRef}
                                                pointerEvents={eventHandler}
                                                texturePath={m.visual.texture}
                                                radius={logScaled(Helpers.ER2LS(m.radius))}
                                                position={new Vector3(0, 0, (b.distanceLS + m.planetDistanceLS * RADIUS_SCALE) / DISTANCE_SCALE )}
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