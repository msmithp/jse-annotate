import { useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { StateSkillData } from "../static/types";
import { Choropleth } from ".";


interface MapBoundsControlProps {
    bounds: number[][]
}

/** Inner map component for bounds fitting */
function MapBoundsControl({ bounds }: MapBoundsControlProps) {
    console.log("Checking bounds...");

    const map = useMap();
    const boundsRef = useRef<number[][]>([[0, 0],[0, 0]]);
    
    // Test if bounds have changed
    const newBottom = Math.floor(bounds[0][0]);
    const newLeft = Math.floor(bounds[0][1]);
    const newTop = Math.floor(bounds[1][0]);
    const newRight = Math.floor(bounds[1][1]);

    const oldBottom = Math.floor(boundsRef.current[0][0]);
    const oldLeft = Math.floor(boundsRef.current[0][1]);
    const oldTop = Math.floor(boundsRef.current[1][0]);
    const oldRight = Math.floor(boundsRef.current[1][1]);

    if (newBottom !== oldBottom || newLeft !== oldLeft 
            || newTop !== oldTop || newRight !== oldRight) {
        console.log(boundsRef.current);
        console.log(bounds);
        console.log("Resetting bounds");
        map.fitBounds(bounds as Leaflet.LatLngBoundsExpression, { padding: [20, 20] });
        boundsRef.current = bounds;
    }

    return null;
}

interface SkillSearchMapProps {
    stateSkills: StateSkillData[],
}

function SkillSearchMap({ stateSkills }: SkillSearchMapProps) {
    console.log("Re-rendering map component");
    console.log(stateSkills);

    // Get list of included state codes
    const states = stateSkills.map(state =>
        state.stateData.stateCode
    );

    let processedFeatures = [];
    for (let i = 0; i < counties.features.length; i++) {
        // Name of current state (e.g., "MD")
        const stateCode = counties.features[i].properties.STATECODE;

        // Filter out all counties not in included states
        if (!states.includes(stateCode)) {
            continue;
        }

        // Name of current county (e.g., "Frederick")
        const countyName = counties.features[i].properties.NAME;

        // FIPS code of current county (e.g., "24021")
        const fips = counties.features[i].properties.GEOID;

        // Get data on current state
        const currentStateData = stateSkills[
            stateSkills.findIndex(item => item.stateData.stateCode === stateCode)
        ];
        
        // Get data on the current county
        const county = currentStateData.countyData[
            currentStateData.countyData.findIndex(item => item.countyFips === fips)
        ];

        // Add skill name to each GeoJSON property
        const properties = {
            NAME: countyName,
            STATECODE: stateCode,
            COUNTYFIPS: fips,
            SKILL: county.skillName,
            JOBS: county.numJobs
        }

        // Add processed feature
        processedFeatures.push({
            type: counties.features[i].type,
            properties: properties,
            geometry: counties.features[i].geometry
        });
    }

    // Cast geoData to FeatureCollection
    const geoData = {
        type: counties.type,
        name: counties.name,
        crs: counties.crs,
        features: processedFeatures
    } as GeoJSON.FeatureCollection;

    function getBounds(): number[][] {
        // Initialize to most extreme lat/lon points in America
        let upperMost = 72;
        let bottomMost = 18;
        let leftMost = -177;
        let rightMost = -67;

        // Iterate through GeoJSON features
        for (let i = 0; i < geoData.features.length; i++) {
            const feature = geoData.features[i];

            if (!feature || !feature.properties) {
                // Skip feature if feature is undefined
                continue;
            }

            let samplePoint: number[] = [];

            if (feature.geometry.type === "Polygon") {
                samplePoint = feature.geometry.coordinates[0][0];
            } else if (feature.geometry.type === "MultiPolygon") {
                samplePoint = feature.geometry.coordinates[0][0][0];
            }

            if (samplePoint.length === 0) {
                // No point found, continue
                console.log("No point");
                continue;
            }

            const lon = samplePoint[0];
            const lat = samplePoint[1];

            if (lat > bottomMost) {
                bottomMost = lat;
            }
            if (lat < upperMost) {
                upperMost = lat;
            }
            if (lon > leftMost) {
                leftMost = lon;
            }
            if (lon < rightMost) {
                rightMost = lon;
            }
        }
        
        const bounds = [
            [bottomMost, leftMost],  // bottom left
            [upperMost, rightMost],  // top right
        ];

        return bounds;
    }

    return (
        <div>
            <MapContainer style={{ height: "400px", width: "600px" }} zoom={6}>
                <TileLayer 
                        attribution='&copy; 
                            <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Choropleth geoData={geoData}/>
                <MapBoundsControl bounds={getBounds()}/>
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
