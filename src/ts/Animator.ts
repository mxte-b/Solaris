import { Quaternion, Vector3 } from "three";
import type { Easing } from "./globals";


type Animatable = Vector3 | Quaternion;

export default class Animator<T extends Animatable> {
    start: T;
    end: T;
    duration: number;
    startTime: number;
    easing: Easing;
    delay: number;

    private static easingFunctions: Record<Easing, (t: number) => number> = {
        "linear": t => t,
        "easeIn": t => t * t,
        "easeOut": t => t * (2 - t),
        "easeInOut": t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        "easeInOutCubic": t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    };

    constructor(start: T, end: T, duration: number, easing: Easing, delay: number = 0) {
        this.start = start.clone() as T;
        this.end = end.clone() as T;
        this.duration = duration;
        this.easing = easing;
        this.delay = delay;
        this.startTime = performance.now();
    }

    getValue(elapsedTime = performance.now() - this.startTime) : T {
        if (elapsedTime < this.delay * 1000) return this.start.clone() as T;
        
        const t = Math.min((elapsedTime - (this.delay * 1000)) / (this.duration * 1000), 1);
        const easedT = this.getEasedT(t);

        const result = this.start.clone() as T;

        if (result instanceof Vector3) {
            return result.lerp(this.end as Vector3, easedT) as T;
        }
        else if (result instanceof Quaternion) {
            return result.slerp(this.end as Quaternion, easedT) as T;
        }
        else {
            throw new Error("Unknown type encountered.")
        }
    }

    isDone(elapsedTime = performance.now() - this.startTime) {
        return elapsedTime >= (this.duration * 1000 + this.delay * 1000);
    }

    private getEasedT(t: number) {
        const easingFunc = Animator.easingFunctions[this.easing];
        if (!easingFunc) throw new Error("Unknown easing function.");

        return easingFunc(t);
    }
}