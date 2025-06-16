import { useFrame } from "@react-three/fiber";
import { useGlobals } from "../ts/globals";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { RefObject } from "react";

const CameraTargetController = ({ orbitControlsRef }: { orbitControlsRef: RefObject<OrbitControlsImpl | null> }) => {
    const selectedPlanet = useGlobals(state => state.selectedPlanet);

    useFrame(() => {
        if (!orbitControlsRef.current || !selectedPlanet?.meshRef.current) return;

        orbitControlsRef.current.target.lerp(selectedPlanet.meshRef.current.position, 0.05);
        orbitControlsRef.current.update();
    });

    return null;
}

export default CameraTargetController;