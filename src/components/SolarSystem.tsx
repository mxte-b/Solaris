import { useEffect } from "react"
import Star from "./Star";
import { Vector3 } from "three";
import Planet from "./Planet";

type Visual = {
  texture: string;
  color: string;
};

type Moon = {
  name: string;
  id: number;
  type: string;
  planetDistanceLS: number;
};

type CelestialBody = {
  name: string;
  id: number;
  type: string;
  distanceLS: number;
  radius: number;
  visual: Visual;
  moons?: Moon[];
};

type SolarSystemData = {
  name: string;
  bodies: CelestialBody[];
};

type SolarSystemProps = {
  data: SolarSystemData;
};

const DISTANCE_SCALE = 2;
const RADIUS_SCALE = 3;

const SolarSystem = ({ data } : SolarSystemProps) => {
    return (
        <>
            {data.bodies.map((b, i) => 
                b.type == "Star" 
                ? <Star key={i} radius={Math.floor(Math.log(b.radius) * RADIUS_SCALE)} position={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE)} color={b.visual.color} texturePath={b.visual.texture}/> 
                : <Planet key={i} radius={b.radius * RADIUS_SCALE} position={new Vector3(0, 0, b.distanceLS / DISTANCE_SCALE)} color="white" texturePath={b.visual.texture}/>
            )}
        </>
    );
}

export default SolarSystem;