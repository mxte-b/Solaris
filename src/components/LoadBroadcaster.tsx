import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

const LoadBroadcaster = ({ onProgress = (p: number) => {} }) => {
    const { progress } = useProgress()

    useEffect(() => {
        onProgress(progress);

        return () => {
            onProgress(100);
        }
    }, [progress])

    return null;
}
export default LoadBroadcaster;