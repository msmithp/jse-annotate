import { useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { mapSkillToColor } from "src/static/utils";
import { StateSkillData } from "../static/types";


interface InnerMapProps {
    bounds: number[][]
}

/** Inner map component for bounds fitting */
function InnerMap({ bounds }: InnerMapProps) {
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

interface HoverData {
    countyName: string,
    stateCode: string,
    skillName: string
}

interface SkillSearchMapProps {
    stateSkills: StateSkillData[],
}

function SkillSearchMap({ stateSkills }: SkillSearchMapProps) {
    // State variables
    const [hover, setHover] = useState<HoverData>({countyName: "", stateCode: "", skillName: ""});

    // Get list of included state codes
    const states = stateSkills.map(state =>
        state.stateData.stateCode
    );

    // Filter out all counties not in included states
    const filteredFeatures = counties.features.filter(feature => (
        states.includes(feature.properties.STATECODE)
    ));

    // Cast geoData to FeatureCollection
    const geoData = {
        type: counties.type,
        name: counties.name,
        crs: counties.crs,
        features: filteredFeatures
    } as GeoJSON.FeatureCollection;

    function style(feature: GeoJSON.Feature | undefined) {
        if (!feature || !feature.properties) {
            // Return empty dictionary if feature is undefined
            return {};
        }

        // Name of current county (e.g., "Frederick")
        const countyName = feature.properties.NAME;

        // Name of current state (e.g., "MD")
        const stateCode = feature.properties.STATECODE;

        // Get data on current state
        const currentState = stateSkills[
            stateSkills.findIndex(item => item.stateData.stateCode === stateCode)
        ];
        
        // Get data on the current county
        const county = currentState.countyData[
            currentState.countyData.findIndex(item => item.countyName === countyName)
        ];

        // Update properties for selected county
        let weight = 2;
        let dashArray = "5";
        if (hover.countyName === countyName && hover.stateCode === stateCode) {
            weight = 3;
            dashArray = "";
        }

        return {
            fillColor: mapSkillToColor(county.skillName),
            weight: weight,
            opacity: 1,
            color: "white",
            dashArray: dashArray,
            fillOpacity: 0.7,
          };
    }

    function onEachFeature(feature: GeoJSON.Feature, layer: Leaflet.Layer) {
        function highlightFeature(e: Leaflet.LayerEvent) {
            let currentLayer = e.target;

            currentLayer.setStyle({
                color: "white",
                dashArray: "",
                weight: 3,
            })
            
            currentLayer.bringToFront();

            // Name of current county (e.g., "Frederick")
            const countyName = feature.properties!.NAME;

            // Name of current state (e.g., "MD")
            const stateCode = feature.properties!.STATECODE;

            // Get data on current state
            const currentState = stateSkills[
                stateSkills.findIndex(item => item.stateData.stateCode === stateCode)
            ];
            
            // Get data on the current county
            const county = currentState.countyData[
                currentState.countyData.findIndex(item => item.countyName === countyName)
            ];

            // ID of skill mapped to this county
            const skillName = county.skillName;

            setHover({
                countyName: feature.properties!.NAME,
                stateCode: feature.properties!.STATECODE,
                skillName: skillName
            });
        }

        function resetHighlight(e: Leaflet.LayerEvent) {
            let currentLayer = e.target;

            // Reset layer's style back to the default
            currentLayer.setStyle(style(feature))

            currentLayer.bringToFront();

            setHover({countyName: "", stateCode: "", skillName: ""});
        }

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        })
    }

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
                <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
                <InnerMap bounds={getBounds()}/>
                <div 
                    style={{
                        position: "absolute", 
                        top: "10px", 
                        right: "10px", 
                        backgroundColor: "rgba(255, 255, 255, 0.7)", 
                        padding: "5px", 
                        borderRadius: "5px", 
                        fontSize: "14px",
                        width: "150px",
                        zIndex: 1000
                    }}>
                    <h4 style={{margin: "0 0 0px"}}>In-Demand Skills</h4>
                    {hover.countyName === "" ? (
                        <div>
                            {"Select a county"}
                        </div>
                    ) : (
                        <div>
                            {hover.countyName + ", " + hover.stateCode} <br /> <b>{hover.skillName}</b>
                        </div>
                    )}
                </div>
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
