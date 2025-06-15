import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Color, Vector3 } from "three";
import { useGlobals } from "../ts/globals";
import { useFrame, useThree } from "@react-three/fiber";
import type { Line2 } from "three/examples/jsm/Addons.js";

/**
 * Props for the Orbit component.
 * @property radius - The radius of the orbit.
 * @property segments - Number of segments to approximate the orbit circle.
 * @property center - The center position of the orbit as a Vector3.
 * @property color - The color of the orbit line.
 */
type OrbitProps = {
    radius: number;
    segments?: number;
    center?: Vector3;
    color?: string;
}

/**
 * Orbit component renders a circular orbit line in 3D space using react-three-fiber.
 * The orbit is centered at the given position and scaled by the global distance scale.
 */
const Orbit = ({ radius, segments = 128, center = new Vector3(0, 0, 0), color = "white" } : OrbitProps) => {
    const lineRef = useRef<Line2>(null);
    const { camera } = useThree();

    // Get the global distance scale from the application state
    const DISTANCE_SCALE = useGlobals(state => state.distanceScale);

    // Memoize the calculation of orbit points to optimize performance
    const points = useMemo(() => {
        const calculated: Vector3[] = [];
        const halfCenter = center.clone().divideScalar(2);

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;

            calculated.push(new Vector3(
                (radius / DISTANCE_SCALE) * Math.cos(theta),
                0,
                (radius / DISTANCE_SCALE) * Math.sin(theta)
            ).add(halfCenter));
        }

        return calculated;
    }, [radius, segments, center]);

    useFrame(() => {
        if (lineRef.current) {
            const viewDir = new Vector3();
            camera.getWorldDirection(viewDir);
        }
    });

    // Render the orbit as a line
    return <Line ref={lineRef} points={points} color={color} />;
}

export default Orbit;