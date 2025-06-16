import { useState, useEffect, type RefObject } from "react";
import { Vector3, TextureLoader, Texture, Mesh } from "three";
import { useGlobals, type PointerEvents } from "../ts/globals";

/**
 * Props for the Planet component.
 * @property position - The position of the planet in 3D space.
 * @property radius - The radius of the planet.
 * @property color - The color of the planet if no texture is provided.
 * @property texturePath - Optional path to a texture image for the planet surface.
 */
type PlanetProps = {
    meshRef: RefObject<Mesh | null>;
    name: string;
    id: number;
    position: Vector3;
    radius: number;
    texturePath: string;
    color?: string;

    // Event handlers
    pointerEvents: PointerEvents
};

/**
 * Planet component renders a 3D sphere representing a planet.
 * Optionally applies a texture to the planet's surface.
 */
const Planet = ({
    name,
    id,
    texturePath,
    pointerEvents,
    radius = 1,
    color = "white",
    meshRef: meshRef,
    position = new Vector3(1, 0, 0),
}: PlanetProps) => {

    const [texture, setTexture] = useState<Texture | null>(null);

    useEffect(() => {
        if (texturePath) {
            const loader = new TextureLoader();
            loader.load(texturePath, (loadedTexture) => {
                setTexture(loadedTexture);
            });
        }
    }, [texturePath]);

    return texture && (
        <mesh 
            ref={meshRef}
            position={position}
            onPointerEnter={pointerEvents.onPointerEnter}
            onPointerOut={pointerEvents.onPointerOut}
            onPointerDown={pointerEvents.onPointerDown}
            onPointerUp={pointerEvents.onPointerUp}
            onClick={pointerEvents.onClick}
            castShadow 
            receiveShadow
        >
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial
                color={color}
                {...(texture ? { map: texture } : {})}
            />
        </mesh>
    );
};

export default Planet;
