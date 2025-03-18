import React from "react";
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";


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

        let fill = "gray";

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
                colorIdx = (colorIdx + 1) % colors.length;
            }

            fill = colorDict[skillID];
        }
        
        return {
            fillColor: fill,
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
          };
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
                <GeoJSON data={geoData} style={style} />
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
