// Main application entry point for the Solaris project.
// Sets up the 3D canvas, postprocessing effects, and loads the solar system scene.

import "./css/App.css"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from '@react-three/drei'
import { Bloom, Noise, Vignette, DepthOfField, EffectComposer } from "@react-three/postprocessing"

import systemData from "./assets/system.json"
import SolarSystem from "./components/SolarSystem"
import { Suspense, useEffect, useRef, useState } from "react"
import HUD from "./components/HUD"
import LoadBroadcaster from "./components/LoadBroadcaster"
import LoadingScreen from "./components/LoadingScreen"
import { Vector2 } from "three"

/**
 * App component sets up the main UI, loading screen, HUD, and 3D scene.
 * It loads the solar system data and renders the 3D environment with postprocessing effects.
 */
function App() {
  const [progress, setProgress] = useState(0);
  const planetPositionsRef = useRef<Map<number, Vector2>>(new Map(
      new Map(systemData.bodies.map(b => [b.id, new Vector2(0, 0)]))
  ));

  return (
    <>
      <LoadingScreen progress={progress} />
      <HUD planetPositionsRef={planetPositionsRef}/>
      <Canvas className="canvas" shadows camera={{ position: [-100, 100, 0], fov:30, far: 100000 }} style={{ backgroundColor: "black", position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        <Suspense fallback={<LoadBroadcaster onProgress={setProgress} />}>
          <SolarSystem system={systemData} planetPositionsRef={planetPositionsRef}/>
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
