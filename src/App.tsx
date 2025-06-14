import "./css/App.css"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Loader} from '@react-three/drei'
import { Bloom, Noise, Vignette, DepthOfField, EffectComposer } from "@react-three/postprocessing"

import systemData from "./assets/system.json"
import SolarSystem from "./components/SolarSystem"
import { Suspense, useEffect, useState } from "react"
import HUD from "./components/HUD"
import LoadBroadcaster from "./components/LoadBroadcaster"
import LoadingScreen from "./components/LoadingScreen"

function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log(systemData)
  }, [])


  return (
    <>
      <LoadingScreen progress={progress} />
      <HUD/>
      <Canvas className="canvas" shadows camera={{ position: [-100, 100, 0], fov:30, far: 100000 }} style={{ backgroundColor: "black", position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        <Suspense fallback={<LoadBroadcaster onProgress={setProgress} />}>
          <SolarSystem data={systemData}/>
          <Environment background backgroundIntensity={0.2} environmentIntensity={0.1} files={[
            'src/assets/skybox/px.jpg',
            'src/assets/skybox/nx.jpg',
            'src/assets/skybox/py.jpg',
            'src/assets/skybox/ny.jpg',
            'src/assets/skybox/pz.jpg',
            'src/assets/skybox/nz.jpg',
          ]}/>
        </Suspense>

        <OrbitControls enableDamping dampingFactor={0.05}/>
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
