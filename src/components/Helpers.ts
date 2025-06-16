import type { RefObject } from "react";

export default class Helpers {
    static KM_PER_LIGHT_SECOND = 299_792.458;
    static KM_PER_EARTH_RADIUS = 6_371;

    static ER2LS(radii: number) : number {
        return (radii * this.KM_PER_EARTH_RADIUS) / this.KM_PER_LIGHT_SECOND;
    }

    static CreateHoverHandler(ref: RefObject<HTMLDivElement | null>, action: "add" | "remove" | "toggle") {
        return (e: PointerEvent) => {
            // Stop the propagation of the event,
            // which prevents multiple planets getting the hover
            e.stopPropagation()
            ref.current?.classList[action]("hover");

            // If the pointer leaves the object, then we 
            // should also remove the active class
            if (action == "remove") {
                ref.current?.classList.remove("active");
            }
        }
    }

    static CreateActiveHandler(ref: RefObject<HTMLDivElement | null>, action: "add" | "remove" | "toggle") {
        return (e: PointerEvent) => {
            e.stopPropagation()
            ref.current?.classList[action]("active");
        }
    }
}