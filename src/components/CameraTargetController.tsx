import { Matrix4, Quaternion, Vector3 } from "three";
import { useGlobals, type TravelStatus } from "../ts/globals";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { DEG2RAD } from "three/src/math/MathUtils.js";
import Animator from "../ts/Animator";

const CameraTargetController = ({ orbitControlsRef }: { orbitControlsRef: RefObject<OrbitControlsImpl | null> }) => {
    const animatorRef = useRef<Animator<Vector3> | null>(null);
    const rotationAnimatorRef = useRef<Animator<Quaternion> | null>(null);
    
    const camera = useThree((state) => state.camera);

    const selectedPlanet = useGlobals(state => state.selectedPlanet);
    const isTravelling = useGlobals(state => state.isTravelling);

    const setTravelStatus = useGlobals(state => state.setTravelStatus);
    const setIsTravelling = useGlobals(state => state.setIsTravelling);
    
    useEffect(() => {
        if (!orbitControlsRef.current || !selectedPlanet?.meshRef.current || isTravelling) return;
        
        setIsTravelling(true);
        setTravelStatus({
            destination: selectedPlanet.name,
            travelDuration: 3
        } as TravelStatus);

        // Disabling the OrbitControls
        orbitControlsRef.current.enabled = false;
        orbitControlsRef.current.enableDamping = false;
        orbitControlsRef.current.update()

        // Calculating target data
        const targetPosition = calculateTargetPosition(7, 30, 10);
        const targetQuaternion = calculateTargetQuaternion(targetPosition, selectedPlanet.meshRef.current.position);

        // Creating the animators
        animatorRef.current = new Animator<Vector3>(camera.position, targetPosition, 3, "easeInOutCubic");
        rotationAnimatorRef.current = new Animator<Quaternion>(camera.quaternion.clone(), targetQuaternion, 2, "easeInOutCubic", 1);
    }, [selectedPlanet])
    
    // Handling the target change
    useFrame(() => {
        if (
            !isTravelling ||
            !orbitControlsRef.current ||
            !selectedPlanet?.meshRef.current ||
            !animatorRef.current ||
            !rotationAnimatorRef.current
        ) return;

        const animator = animatorRef.current;
        const rotationAnimator = rotationAnimatorRef.current;

        // Updating camera position & quaternion
        camera.position.copy(animator.getValue());
        camera.quaternion.copy(rotationAnimator.getValue())

        // If both animations are finished, cleanup
        if (animator.isDone() && rotationAnimator.isDone()) {
            setIsTravelling(false);

            animatorRef.current = null;
            rotationAnimatorRef.current = null;

            orbitControlsRef.current.target.copy(selectedPlanet.meshRef.current.position)
            orbitControlsRef.current.enabled = true;
            orbitControlsRef.current.enableDamping = true;
            orbitControlsRef.current.update();
        }
    }, 0);

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
    };

    const calculateTargetQuaternion = (cameraPosition: Vector3, targetPosition: Vector3) : Quaternion => {
        const up = new Vector3(0, 1, 0);

        // Get rotation matrix
        const rotationMatrix = new Matrix4();
        rotationMatrix.lookAt(cameraPosition, targetPosition, up);

        return new Quaternion().setFromRotationMatrix(rotationMatrix);
    };

    return null;
}

export default CameraTargetController;