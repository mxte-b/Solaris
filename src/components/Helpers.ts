export default class Helpers {
    static KM_PER_LIGHT_SECOND = 299_792.458;
    static KM_PER_EARTH_RADIUS = 6_371;

    static ER2LS(radii: number) : number {
        return (radii * this.KM_PER_EARTH_RADIUS) / this.KM_PER_LIGHT_SECOND;
    }
}