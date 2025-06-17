import { Vector3 } from "three";
import { useGlobals } from "../ts/globals";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState, type RefObject } from "react";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const CameraTargetController = ({ orbitControlsRef }: { orbitControlsRef: RefObject<OrbitControlsImpl | null> }) => {
    const selectedPlanet = useGlobals(state => state.selectedPlanet);

    const [targetReached, setTargetReached] = useState<boolean>(true);
    const [targetPosition, setTargetPosition] = useState<Vector3>(new Vector3(0, 0, 0));

    const { camera } = useThree();
    
    useEffect(() => {
        if (!orbitControlsRef.current || !selectedPlanet?.meshRef.current) return;

        setTargetReached(false);
        orbitControlsRef.current.enabled = false;

        setTargetPosition(calculateTargetPosition(10));
    }, [selectedPlanet])
    
    useFrame(() => {
        if (!orbitControlsRef.current || !selectedPlanet?.meshRef.current) return;

        orbitControlsRef.current.target.lerp(selectedPlanet.meshRef.current.position, 0.02);
        orbitControlsRef.current.update();
        
        if (targetReached) return;
        camera.position.lerp(targetPosition, 0.02);
        
        if (camera.position.distanceTo(targetPosition) < 0.1) {
            orbitControlsRef.current.enabled = true;
            setTargetReached(true);
        }
    });

    const calculateTargetPosition = (ratio: number) : Vector3 => {

        if (!selectedPlanet?.meshRef.current) {
            throw new Error("The planet reference is missing");
        }
        
        // Get planet position and radius
        const planetPosition = selectedPlanet.meshRef.current.position;
        const planetRadius = selectedPlanet.meshRef.current.geometry.boundingSphere!.radius;

        // Calculate the target distance and planet->cam direction 
        const targetDistance = planetRadius * ratio;
        const planetDir = camera.position.clone().sub(planetPosition).normalize();

        // Calculate the target position
        return planetPosition.clone().add(planetDir.multiplyScalar(targetDistance));
    }

    return null;
}

export default CameraTargetController;