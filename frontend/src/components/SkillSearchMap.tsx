import React from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { mapSkillToColor } from "src/static/utils";

// Placeholder data
const stateSkills = [
    {
        stateData: {
            stateID: 0,
            stateName: "Delaware",
            stateCode: "DE"
        },
        countyData: [
            {countyID: 0, countyName: "Kent", skillID: 5, skillName: "Python"},
            {countyID: 1, countyName: "New Castle", skillID: 6, skillName: "Go"},
            {countyID: 2, countyName: "Sussex", skillID: 9, skillName: "Java"}
        ]
    },
    {
        stateData: {
            stateID: 1,
            stateName: "Rhode Island",
            stateCode: "RI"
        },
        countyData: [
            {countyID: 5, countyName: "Bristol", skillID: 5, skillName: "Python"},
            {countyID: 6, countyName: "Kent", skillID: 18, skillName: "JavaScript"},
            {countyID: 7, countyName: "Newport", skillID: 9, skillName: "Java"},
            {countyID: 10, countyName: "Providence", skillID: 9, skillName: "Java"},
            {countyID: 23, countyName: "Washington", skillID: 9, skillName: "Java"}
        ]
    }
];

interface InnerMapProps {
    bounds: Leaflet.LatLngBoundsExpression
}

/** Inner map component for bounds fitting */
function InnerMap({ bounds }: InnerMapProps) {
    const map = useMap();
    map.fitBounds(bounds, {padding: [20, 20]});

    return null;
}

interface SkillSearchMapProps {
    states: {
        stateData: {
            stateID: number,
            stateName: string,
            stateCode: string
        }
        countyData: {
            countyID: number,
            countyName: string,
            skillID: number,
            skillName: string
        }[]
    }[],
}

function SkillSearchMap() {
    // Cast geoData to FeatureCollection
    const geoData = counties as GeoJSON.FeatureCollection;

    function style(feature: GeoJSON.Feature | undefined) {
        if (!feature || !feature.properties) {
            // Return empty dictionary if feature is undefined
            return {};
        }

        // Default values for counties outside of the current state
        let fill = "gray";
        let stroke = "";
        let weight = 0.5;

        // Check if this county is in the current state selection
        let isInState = false;
        for (let i = 0; i < stateSkills.length; i++) {
            if (feature.properties.STATECODE === stateSkills[i].stateData.stateCode) {
                isInState = true;
                break;
            }
        }

        if (isInState) {
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

            // ID of skill mapped to this county
            const skillID = county.skillID;

            // Update properties for county in this state
            fill = mapSkillToColor(skillID);
            stroke = "white";
            weight = 2;
        }
        
        return {
            fillColor: fill,
            weight: weight,
            opacity: 1,
            color: stroke,
            dashArray: "5",
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
        }

        function resetHighlight(e: Leaflet.LayerEvent) {
            let currentLayer = e.target;

            // Reset layer's style back to the default
            currentLayer.setStyle(style(feature))

            currentLayer.bringToFront();
        }

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        })
    }

    function getBounds(): Leaflet.LatLngBoundsExpression {
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

            // Check if this county is in the current state selection
            let isInState = false;
            for (let i = 0; i < stateSkills.length; i++) {
                if (feature.properties.STATECODE === stateSkills[i].stateData.stateCode) {
                    isInState = true;
                    break;
                }
            }

            // Only count bounds if this county is in the states we're showing
            if (isInState) {
                let samplePoint: number[] = [];

                if (feature.geometry.type === "Polygon") {
                    samplePoint = feature.geometry.coordinates[0][0];
                } else if (feature.geometry.type === "MultiPolygon") {
                    samplePoint = feature.geometry.coordinates[0][0][0];
                }

                if (samplePoint.length === 0) {
                    // No point found, continue
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
        }
        
        const bounds: Leaflet.LatLngBoundsExpression = [
            [bottomMost, leftMost],  // bottom left
            [upperMost, rightMost],  // top right
        ];

        return bounds;
    }

    return (
        <div>
            <MapContainer style={{ height: "400px", width: "600px" }} 
                center={[39.422962, -77.418918]} zoom={6}>
                <TileLayer 
                        attribution='&copy; 
                            <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
                <InnerMap bounds={getBounds()}/>
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
