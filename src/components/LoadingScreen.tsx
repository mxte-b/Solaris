import { useEffect, useRef } from "react";
import gsap from "gsap";

const LoadingScreen = ({ progress = 0 }) => {
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animation : GSAPAnimation;
        if (progress == 100) {
            setTimeout(() => {
                animation = gsap.to(loaderRef.current, 
                    {
                        "opacity":0,
                        "duration":1,
                        "ease": "power3.inOut",
                        "onComplete": () => {
                            if (loaderRef.current) {
                                loaderRef.current.remove();
                            }
                        }
                    });
            }, 100)
        }

        return () => {
            if (animation) {
                animation.kill();
            }
        }
    }, [progress])

    return (
        <div className="loader" ref={loaderRef}>
            <h1 className="gradient">Loading... {progress.toFixed(0)}%</h1>
        </div>
    );
}
export default LoadingScreen;