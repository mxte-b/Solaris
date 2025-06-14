import "./css/App.css"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment} from '@react-three/drei'
import { Bloom, Noise, Vignette, DepthOfField, EffectComposer } from "@react-three/postprocessing"

import systemData from "./assets/system.json"
import SolarSystem from "./components/SolarSystem"
import { useEffect } from "react"
import HUD from "./components/HUD"

function App() {
  useEffect(() => {
    console.log(systemData)
  })

  return (
    <>
      <Canvas shadows camera={{ position: [-100, 100, 0], fov:30, far: 100000 }} style={{ backgroundColor: "black", position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>

        <SolarSystem data={systemData}/>

        <HUD/>
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
          {/* <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} height={480} /> */}
          <Bloom intensity={1.2} luminanceThreshold={0.5} opacity={0.2} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1} />
        </EffectComposer>
      </Canvas>
    </>
  )
}

export default App
