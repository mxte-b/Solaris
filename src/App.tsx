
import { Canvas } from "@react-three/fiber"
import "./css/App.css"
import { Bloom, EffectComposer } from "@react-three/postprocessing"
import { OrbitControls, Environment} from '@react-three/drei'
import Star from "./ts/Star"
import { Vector3 } from "three"
import Planet from "./ts/Planet"

function App() {
  return (
    <>
      <Canvas camera={{ position: [-10, 20, 0], fov:50 }} style={{ backgroundColor: "black", position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>

        <Star position={new Vector3(0, 0, 0)} color="#FFCF37" texturePath={"src/assets/planets/sun.jpg"}/>
        <Planet position={new Vector3(0, 0, 10)} color="white" texturePath={"src/assets/planets/earth.jpg"}/>

        <OrbitControls/>

        <Environment background backgroundIntensity={0.2} environmentIntensity={0.1} files={[
          'src/assets/skybox/px.png',
          'src/assets/skybox/nx.png',
          'src/assets/skybox/py.png',
          'src/assets/skybox/ny.png',
          'src/assets/skybox/pz.png',
          'src/assets/skybox/nz.png',
        ]}/>

        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.5} opacity={0.2} />
        </EffectComposer>
      </Canvas>
    </>
  )
}

export default App
