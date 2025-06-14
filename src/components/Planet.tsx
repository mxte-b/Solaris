import { useState, useEffect } from "react";
import { Vector3, TextureLoader, Texture } from "three";

type PlanetProps = {
  position?: Vector3;
  radius?: number;
  color?: string;
  texturePath?: string | null;
};

const Planet = ({
  position = new Vector3(1, 0, 0),
  radius = 1,
  color = "white",
  texturePath = null,
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

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          {...(texture ? { map: texture } : {})}
        />
      </mesh>
    </group>
  );
};

export default Planet;
