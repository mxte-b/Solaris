import gsap from "gsap"
import type { RefObject } from "react";
import { type RefPair } from "../ts/globals";

export default class Helpers {
    static KM_PER_LIGHT_SECOND = 299_792.458;
    static KM_PER_EARTH_RADIUS = 6_371;

    static clearSelectedIndicator(newIndicator: RefObject<HTMLDivElement | null>): void {
        const selected = document.querySelector(".planet-indicator.selected") as HTMLDivElement;
        if (!selected) return;

        // If the selected 
        if (newIndicator.current && newIndicator.current == selected) return;

        this.DeselectIndicator(selected);
    }

    static ER2LS(radii: number) : number {
        return (radii * this.KM_PER_EARTH_RADIUS) / this.KM_PER_LIGHT_SECOND;
    }

    static CreateHoverHandler(ref: RefObject<HTMLDivElement | null>, action: "add" | "remove" | "toggle") {
        return (e: PointerEvent) => {
            // Stop the propagation of the event,
            // which prevents multiple planets getting the hover
            e.stopPropagation();
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
            e.stopPropagation();
            ref.current?.classList[action]("active");
        }
    }

    static CreateClickHandler(planet: RefPair, onClick: (planet: RefPair) => void) {
        return (e: PointerEvent) => {
            e.stopPropagation();
            onClick(planet);
            this.clearSelectedIndicator(planet.domRef);

            if (!planet.domRef.current) return;

            this.SelectIndicator(planet.domRef.current);
        }
    }
    
    static SelectIndicator(target: HTMLDivElement): void {
        target.classList.add("selected");
        const selection = target.querySelector(".planet-selection")

        gsap.to(selection, {
            duration: 1,
            "--border-length-x": "20px",
            "--border-length-y": "20px",
            backgroundColor: "#ffbb2914",
            rotate: "45deg",
            ease: "power3.inOut"
        })

        gsap.to(selection, {
            duration: 0.5,
            delay: 1,
            scale: 0.8,
            ease: "power3.inOut"
        })
    }

    static SelectIndicatorInstant(target: HTMLDivElement): void {
        target.classList.add("selected");
        const selection = target.querySelector(".planet-selection")

        gsap.set(selection, {
            "--border-length-x": "20px",
            "--border-length-y": "20px",
            backgroundColor: "#ffbb2914",
            rotate: "45deg",
            scale: 0.8
        })
    }

    static DeselectIndicator(target: HTMLDivElement): void {
        target.classList.remove("selected");

        gsap.to(target.querySelector(".planet-selection"), {
            duration: 1,
            "--border-length-x": "5px",
            "--border-length-y": "5px",
            backgroundColor: "transparent",
            rotate: "0deg",
            scale: 1,
            ease: "power3.inOut"
        })
    } 
}