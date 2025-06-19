export class CubicBezier {
    P0: number;
    P1: number;
    P2: number;
    P3: number;

    constructor(p0: number, p1: number, p2: number, p3: number) {
        this.P0 = p0;
        this.P1 = p1;
        this.P2 = p2;
        this.P3 = p3;
    }

    getFunction() {
        return (t: number) => {
            const u = 1 - t;

            return (
                u * u * u * this.P0 +
                3 * u * u * t * this.P1 +
                3 * u * t * t * this.P2 +
                t * t * t * this.P3
            );
        }
    }
}