import "@react-three/fiber"
import { Vector3, TextureLoader } from "three";
import { useLoader } from '@react-three/fiber'
import { useMemo } from "react";


type StarProps = {
  position?: Vector3
  radius?: number
  color?: string
  lightColor?: string
  texturePath?: string | null
}

const Star = ({
    position = new Vector3(1, 0, 0),
    radius = 1,
    color = "white",
    lightColor = "white",
    texturePath = null
} : StarProps) => {
    
    const texture = useMemo(() => texturePath ? useLoader(TextureLoader, texturePath) : null, [texturePath]);

    return (
        <mesh position = {position}>
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