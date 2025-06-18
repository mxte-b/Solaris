import { Euler, Vector3 } from "three";
import { useGlobals } from "../ts/globals";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { DEG2RAD } from "three/src/math/MathUtils.js";
import Animator from "../ts/Animator";

const CameraTargetController = ({ orbitControlsRef }: { orbitControlsRef: RefObject<OrbitControlsImpl | null> }) => {
    const [targetReached, setTargetReached] = useState<boolean>(true);
    // const [targetPosition, setTargetPosition] = useState<Vector3>(new Vector3(0, 0, 0));

    const animatorRef = useRef<Animator | null>(null);
    const targetAnimatorRef = useRef<Animator | null>(null);
    
    const { camera } = useThree();
    const selectedPlanet = useGlobals(state => state.selectedPlanet);
    
    useEffect(() => {
        if (!orbitControlsRef.current || !selectedPlanet?.meshRef.current) return;
        
        setTargetReached(false);
        orbitControlsRef.current.enabled = false;
        orbitControlsRef.current.enableDamping = false;

        const targetPosition = calculateTargetPosition(7, 30, 10);

        // Creating the animators
        animatorRef.current = new Animator(camera.position, targetPosition, 4, "easeInOutCubic");
        targetAnimatorRef.current = new Animator(orbitControlsRef.current.target, selectedPlanet.meshRef.current.position, 4, "easeInOutCubic");
    }, [selectedPlanet])
    
    // Handling the target change
    useFrame(() => {
        if (targetReached) return;
        if (!orbitControlsRef.current || !selectedPlanet?.meshRef.current) return;

        if (!animatorRef.current || !targetAnimatorRef.current) return;
        
        
        const animator = animatorRef.current;
        const targetAnimator = targetAnimatorRef.current;

        // Updating camera position
        camera.position.copy(animator.getValue());
        
        // Updating OrbitControl target position
        orbitControlsRef.current.target.copy(targetAnimator.getValue())
        orbitControlsRef.current.update();
        
        // If both animations are finished, cleanup
        if (animator.isDone() && targetAnimator.isDone()) {
            setTargetReached(true);
            animatorRef.current = null;
            orbitControlsRef.current.enabled = true;
            orbitControlsRef.current.enableDamping = true;
        }
    });

    /**
     * Calculates the target position for the camera based on a specified relative distance, and the angle that the camera should be at relative to the planet.
     * @param ratio The ratio of the planet's radius and the camera's distance
     * @param yawDeg The "Left/Right" angle.
     * @param pitchDeg The "Up/Down" angle.
     * @returns The target position
     */
    const calculateTargetPosition = (ratio: number, yawDeg: number, pitchDeg: number) : Vector3 => {

        if (!selectedPlanet?.meshRef.current) {
            throw new Error("The planet reference is missing");
        }
        
        const yaw = yawDeg * DEG2RAD;
        const pitch = (180 - pitchDeg) * DEG2RAD;

        const planetPosition = selectedPlanet.meshRef.current.position;
        const radius = selectedPlanet.meshRef.current.geometry.boundingSphere!.radius * ratio;

        // Spherical -> Cartesian
        const x = radius * Math.cos(pitch) * Math.sin(yaw);
        const y = radius * Math.sin(pitch);
        const z = radius * Math.cos(pitch) * Math.cos(yaw);

        return planetPosition.clone().add(new Vector3(x, y, z));
    }

    return null;
}

export default CameraTargetController;