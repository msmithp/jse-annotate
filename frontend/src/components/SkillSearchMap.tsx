import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
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
    }[]
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
            // TODO: This is too computationally expensive, change it to just
            // check if county is in state and set color/dashArray/weight accordingly
            currentLayer.setStyle(style(feature))

            currentLayer.bringToFront();
        }

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        })
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
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
