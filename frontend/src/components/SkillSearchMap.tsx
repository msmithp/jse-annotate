import React from "react";
import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import counties from "../geodata/counties.json";


function InnerMap() {
    const map = useMap();

    
}

interface SkillSearchMapProps {

}

function SkillSearchMap() {
    // Cast geoData to FeatureCollection
    const geoData = counties as GeoJSON.FeatureCollection;

    const mapOptions = {

    }

    function style(feature: GeoJSON.Feature | undefined) {
        if (!feature) {
            // Return empty dictionary if feature is undefined
            return {};
        }
        
        return {
            fillColor: "#800026",
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
