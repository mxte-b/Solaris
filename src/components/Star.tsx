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

    const lights = useMemo(() => {
        const dirs = [
            new Vector3(1,0,0), new Vector3(-1,0,0),
            new Vector3(0,1,0), new Vector3(0,-1,0),
            new Vector3(0,0,1), new Vector3(0,0,-1),
        ];

        return dirs.map((d) => ({
            pos: d.multiplyScalar(radius * 0.9).add(position),
        }))
    }, [position, radius])

    const texture = useMemo(() => texturePath ? useLoader(TextureLoader, texturePath) : null, [texturePath]);

    return (
        <mesh position = {position}>
            <sphereGeometry args={[radius, 32, 32]}/>
            <meshStandardMaterial emissive={color} {...(texture ? { emissiveMap: texture } : { color: color})} emissiveIntensity={3}/>
            {lights.map((l, i) => (
                <pointLight
                key={i}
                position={l.pos}
                intensity={200}
                distance={1000000}
                decay={1}
                color={lightColor}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                />
            ))}
            <pointLight
                position={position}
                intensity={200}
                distance={1000}
                decay={1}
                color={lightColor}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
        </mesh>
    )
}

export default Star;