import React from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import Leaflet from "leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";

// Placeholder data
const countySkills = {
    state: {
        stateID: 0,
        stateName: "Delaware",
        stateCode: "DE"
    },
    countyData: [
        {countyID: 0, countyName: "Kent", skillID: 5, skillName: "Python"},
        {countyID: 1, countyName: "New Castle", skillID: 6, skillName: "Go"},
        {countyID: 2, countyName: "Sussex", skillID: 9, skillName: "Java"}
    ]
}

const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

interface SkillSearchMapProps {
    state: {
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
}

function SkillSearchMap() {
    // Cast geoData to FeatureCollection
    const geoData = counties as GeoJSON.FeatureCollection;

    // Data on all counties in this state
    const allCounties = countySkills.countyData;

    let colorDict: { [skillName: string]: string } = {};
    let colorIdx = 0;

    function style(feature: GeoJSON.Feature | undefined) {
        if (!feature || !feature.properties) {
            // Return empty dictionary if feature is undefined
            return {};
        }

        // Default values for counties outside of the current state
        let fill = "gray";
        let stroke = "";
        let weight = 0.5;

        // Check if this county is in the current state
        if (feature.properties.STATECODE == countySkills.state.stateCode) {
            // Name of current county (e.g., "Sussex")
            const countyName = feature.properties.NAME;

            // Get data on the current county
            const county = allCounties[allCounties.findIndex(item => item.countyName === countyName)];

            // ID of skill mapped to this county
            const skillID = county.skillID;

            if (!(skillID in colorDict)) {
                // If this skill is not in the color dictionary, assign it a
                // new color from the colors list and add it to the dictionary
                colorDict[skillID] = colors[colorIdx];

                // Increment index so next new skill will take a different color
                colorIdx = (colorIdx + 1) % colors.length;
            }

            // Update properties for county in this state
            fill = colorDict[skillID];
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
