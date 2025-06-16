import "./css/App.css"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from '@react-three/drei'
import { Bloom, Noise, Vignette, DepthOfField, EffectComposer } from "@react-three/postprocessing"

import systemData from "./assets/system.json"
import SolarSystem from "./components/SolarSystem"
import { createRef, Suspense, useEffect, useRef, useState } from "react"
import HUD from "./components/HUD"
import LoadBroadcaster from "./components/LoadBroadcaster"
import LoadingScreen from "./components/LoadingScreen"
import { Mesh } from "three"
import { useGlobals, type RefPair } from "./ts/globals"
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import CameraTargetController from "./components/CameraTargetController"

/**
 * App component sets up the main UI, loading screen, HUD, and 3D scene.
 * It loads the solar system data and renders the 3D environment with postprocessing effects.
 */
function App() {
    const [progress, setProgress] = useState(0);

    const selectedPlanet = useGlobals(state => state.selectedPlanet);
    const orbitControlsRef = useRef<OrbitControlsImpl>(null);

    const pairsRef = useRef<RefPair[]>(
        systemData.bodies.flatMap((b) => [
            // Adding the planet to the references
            {
                id:      b.id,
                name:    b.name,
                meshRef: createRef<Mesh>(),
                domRef:  createRef<HTMLDivElement>(),
            },
            // Adding all its moons to the references
            ...(b.moons || []).map(m => ({
                id:      m.id,
                name:    m.name,
                meshRef: createRef<Mesh>(),
                domRef:  createRef<HTMLDivElement>(),
            }))
        ])
    );

    return (
        <>
            <LoadingScreen progress={progress} />
            <HUD pairsRef={pairsRef}/>

            <Canvas className="canvas" shadows camera={{ position: [-100, 100, 0], fov:30, far: 100000 }} style={{ backgroundColor: "black", position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh" }}>
                <Suspense fallback={<LoadBroadcaster onProgress={setProgress} />}>
                    <SolarSystem system={systemData} pairsRef={pairsRef}/>
                    <Environment background backgroundIntensity={0.2} environmentIntensity={0.1} files={[
                        'src/assets/skybox/px.jpg',
                        'src/assets/skybox/nx.jpg',
                        'src/assets/skybox/py.jpg',
                        'src/assets/skybox/ny.jpg',
                        'src/assets/skybox/pz.jpg',
                        'src/assets/skybox/nz.jpg',
                    ]}/>
                </Suspense>

                <OrbitControls ref={orbitControlsRef} enableDamping={true} dampingFactor={0.1} rotateSpeed={0.5} enablePan={false}/>
                <CameraTargetController orbitControlsRef={orbitControlsRef} />
                <EffectComposer>
                    <Bloom intensity={1.2} luminanceThreshold={0.5} opacity={0.2} />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1} />
                </EffectComposer>
            </Canvas>
        </>
    )
}

export default App
