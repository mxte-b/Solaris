import type { Vector3 } from "three";
import type { Easing } from "./globals";


export default class Animator {
    start: Vector3;
    end: Vector3;
    duration: number;
    startTime: number;
    easing: Easing;

    private static easingFunctions: Record<Easing, (t: number) => number> = {
        "linear": t => t,
        "easeIn": t => t * t,
        "easeOut": t => t * (2 - t),
        "easeInOut": t => t < 0.5
            ? 2 * t * t
            : -1 + (4 - 2 * t) * t,
        "easeInOutCubic": t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    };

    constructor(start: Vector3, end: Vector3, duration: number, easing: Easing) {
        this.start = start.clone();
        this.end = end.clone();
        this.duration = duration;
        this.easing = easing;
        this.startTime = performance.now();
    }

    getValue(time = performance.now()) {
        const t = Math.min((time - this.startTime) / (this.duration * 1000), 1);
        const easedT = this.getEasedT(t);
        return this.start.clone().lerp(this.end, easedT);
    }

    isDone(time = performance.now()) {
        return (time - this.startTime) >= (this.duration * 1000);
    }

    private getEasedT(t: number) {
        const easingFunc = Animator.easingFunctions[this.easing];
        if (!easingFunc) throw new Error("Unknown easing function.");

        return easingFunc(t);
    }
}