import "../css/HUD.css"
import Helpers from "../ts/Helpers";
import gsap from "gsap";
import { useEffect, type RefObject } from "react";
import { useGlobals, type RefPair } from "../ts/globals";

/**
 * HUD (Heads-Up Display) component renders the navigation bar and branding for the application.
 */
const HUD = ({ pairsRef } : { pairsRef: RefObject<RefPair[]>}) => {

    const travelStatus = useGlobals(state => state.travelStatus);

    useEffect(() => {
        if (!travelStatus) return;

        // Animating the main element
        gsap.set(".travel-status", { y: "100%" });
        gsap.to(".travel-status", {
            duration: 0.5,
            y: 0,
            ease: "power3.inOut"
        })

        // Animating the progress bar
        gsap.set(".travel-progress", { width: 0 });
        gsap.to(".travel-progress", {
            delay: 0.5,
            duration: travelStatus.travelDuration - 0.5,
            width: "100%"
        });

        // Hide the main element
        setTimeout(() => {
            // Animating the main element
            gsap.to(".travel-status", {
                duration: 0.5,
                y: "100%",
                ease: "power3.inOut"
            })
        }, travelStatus.travelDuration * 1000);

        return () => {
            gsap.killTweensOf(".travel-status, .travel-progress");
        }
    }, [travelStatus]);

    // Animate the default selected indicator
    useEffect(() => {
        Helpers.SelectIndicatorInstant(document.querySelector(".planet-indicator.selected") as HTMLDivElement);
    }, [])

    return (
        <div style={{ width: "100%", height: "100vh"}}>
            <div className="navbar">
                <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M28.45 9.6c1.57-3 2.07-5.5.76-6.81s-3.48-1-6.67.67a.64.64 0 0 0-.13.1 13.82 13.82 0 0 0-3.31-1.21 1 1 0 0 0-1.2.75 1 1 0 0 0 .76 1.2 12 12 0 0 1 5.83 3.21 12.26 12.26 0 0 1 1.66 2.1 47 47 0 0 1-7.36 9.18 56.81 56.81 0 0 1-6.22 5.41 1 1 0 0 0 1.19 1.61 58.87 58.87 0 0 0 6.45-5.6 53.63 53.63 0 0 0 7-8.49 12 12 0 0 1-2.71 12.77 12 12 0 1 1-10-20.4 1 1 0 0 0-.24-2 14 14 0 0 0-10.7 20.32.41.41 0 0 0-.1.13c-1.67 3.19-1.9 5.44-.67 6.67A2.86 2.86 0 0 0 4.9 30a10.38 10.38 0 0 0 4.56-1.45.41.41 0 0 0 .13-.1A14 14 0 0 0 28.45 9.6zM25.9 6.1a14.51 14.51 0 0 0-1.52-1.32c2.14-1 3.15-.84 3.41-.57s.22 1.6-.59 3.41a14.31 14.31 0 0 0-1.3-1.52zM4.21 27.79c-.27-.26-.4-1.28.58-3.43A15.7 15.7 0 0 0 6.1 25.9a15.7 15.7 0 0 0 1.54 1.31c-2.15.98-3.16.85-3.43.58z"/></svg>
                <div className="navgroup">
                    <h1 className="title gradient">S0LARIS</h1>
                    <h5 className="description">Explore the Solar System</h5>
                </div>
                <h5 className="credits">
                    Made by mxte_b with ❤︎
                </h5>
            </div>
            <div className="hud">
                {pairsRef.current.map((pair, i) => (
                    <div key={i} ref={pair.domRef} className={"planet-indicator" + ((pair.id > 100) ? " moon" : "") + (i == 0 ? " selected" : "")}>
                        <div className="planet-name">{pair.name}</div>
                        <div className="planet-selection"/>
                    </div>
                ))}
                { travelStatus && <div className="travel-status">
                    <div className="travel-info">
                        <div className="travel-destination">Travelling to {travelStatus.destination}</div>
                        <div className="travel-progress-wrapper">
                            <div className="travel-progress"></div>
                        </div>
                    </div>
                </div> }
            </div>
        </div>
    );
}

export default HUD;