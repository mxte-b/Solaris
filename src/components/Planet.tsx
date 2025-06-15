import { useState, useEffect, type RefObject } from "react";
import { Vector3, TextureLoader, Texture, Mesh } from "three";
import { useGlobals } from "../ts/globals";

/**
 * Props for the Planet component.
 * @property position - The position of the planet in 3D space.
 * @property radius - The radius of the planet.
 * @property color - The color of the planet if no texture is provided.
 * @property texturePath - Optional path to a texture image for the planet surface.
 */
type PlanetProps = {
  positionRef: RefObject<Mesh | null>;
  name: string;
  id: number;
  position: Vector3;
  radius: number;
  color?: string;
  texturePath?: string | null;
};

/**
 * Planet component renders a 3D sphere representing a planet.
 * Optionally applies a texture to the planet's surface.
 */
const Planet = ({
  positionRef,
  name,
  id,
  position = new Vector3(1, 0, 0),
  radius = 1,
  color = "white",
  texturePath = null,
}: PlanetProps) => {

  const [texture, setTexture] = useState<Texture | null>(null);
  const [hovered, setHovered] = useState<boolean>(false);
  const setSelectedPlanet = useGlobals(state => state.setSelectedPlanet);

  useEffect(() => {
    if (texturePath) {
      const loader = new TextureLoader();
      loader.load(texturePath, (loadedTexture) => {
        setTexture(loadedTexture);
      });
    }
  }, [texturePath]);

  return (
    <mesh 
      ref={positionRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setSelectedPlanet(id)}
      castShadow 
      receiveShadow
    >
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "red" : color}
        {...(texture ? { map: texture } : {})}
      />
    </mesh>
  );
};

export default Planet;
