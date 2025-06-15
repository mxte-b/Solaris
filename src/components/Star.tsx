import "@react-three/fiber"
import { Vector3, TextureLoader, Mesh } from "three";
import { useLoader } from '@react-three/fiber'
import { useMemo, type RefObject } from "react";

/**
 * Props for the Star component.
 * @property position - The position of the star in 3D space.
 * @property radius - The radius of the star.
 * @property color - The emissive color of the star's surface.
 * @property lightColor - The color of the point light emitted by the star.
 * @property texturePath - Optional path to a texture image for the star's surface.
 */
type StarProps = {
  positionRef: RefObject<Mesh | null>;
  position?: Vector3
  radius?: number
  color?: string
  lightColor?: string
  texturePath?: string | null
}

/**
 * Star component renders a glowing sphere with an optional texture and a point light.
 * Used to represent stars in the solar system.
 */
const Star = ({
    positionRef,
    position = new Vector3(1, 0, 0),
    radius = 1,
    color = "white",
    lightColor = "white",
    texturePath = null
} : StarProps) => {
    
    const texture = useMemo(() => texturePath ? useLoader(TextureLoader, texturePath) : null, [texturePath]);

    return (
        <mesh ref={positionRef} position = {position}>
            <sphereGeometry args={[radius, 32, 32]}/>
            <meshStandardMaterial emissive={color} {...(texture ? { emissiveMap: texture } : { color: color})} emissiveIntensity={3}/>
            <pointLight
                position={position}
                intensity={10}
                distance={1000000}
                decay={0.2}
                color={lightColor}
            />
        </mesh>
    )
}

export default Star;