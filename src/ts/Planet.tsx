import "@react-three/fiber"
import { Vector3, TextureLoader } from "three";
import { useLoader } from '@react-three/fiber'

type PlanetProps = {
  position?: Vector3
  radius?: number
  color?: string
  texturePath?: string | null
}

const Planet = ({
    position = new Vector3(1, 0, 0),
    radius = 1,
    color = "white",
    texturePath = null
} : PlanetProps) => {
    const texture = texturePath ? useLoader(TextureLoader, texturePath) : null;

    return (
        <mesh position = {position}>
            <sphereGeometry args={[radius, 32, 32]}/>
            <meshStandardMaterial color={color} {...(texture ? { map: texture } : {})}/>
        </mesh>
    )
}

export default Planet;