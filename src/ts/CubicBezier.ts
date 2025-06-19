
export class CubicBezier {
    private BINARY_ITERS = 7;
    private NEWTON_ITERS = 4;

    P1X: number;
    P1Y: number;
    P2X: number;
    P2Y: number;

    constructor(p1x: number, p1y: number, p2x: number, p2y: number) {
        this.P1X = p1x;
        this.P1Y = p1y;
        this.P2X = p2x;
        this.P2Y = p2y;
    }

    private Bx(t: number): number {
        const u = 1 - t;

        return (
            3 * u * u * t * this.P1X +
            3 * u * t * t * this.P2X +
            t * t * t
        );
    }

    private BxDerivative(t: number): number {
        const u = 1 - t;

        return (
            3 * u * u * this.P1X +
            6 * u * t * (this.P2X - this.P1X) + 
            3 * t * t * (1 - this.P2X)
        );
    }

    private By(t: number): number {
        const u = 1 - t;

        return (
            3 * u * u * t * this.P1Y +
            3 * u * t * t * this.P2Y +
            t * t * t
        );
    }

    getFunction() {
        return (t: number) => {
            // Binary search
            let low = 0;
            let high = 1;
            let mid = 0;

            for (let i = 0; i < this.BINARY_ITERS; i++) {
                mid = (low + high) / 2;
                const x = this.Bx(mid);

                if (x < t) low = mid;
                else high = mid;
            }

            // Newton-Raphson
            for (let i = 0; i < this.NEWTON_ITERS; i++) {
                const x = this.Bx(mid)
                const dx = this.BxDerivative(mid);

                if (Math.abs(dx) < 1e-6) break;

                const delta = (x - t) / dx;
                mid -= delta;
                
                if (Math.abs(delta) < 1e-5) break;
            }

            return this.By(mid);
        };
    }
}