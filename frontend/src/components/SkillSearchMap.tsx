import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";


function InnerMap() {
    const map = useMap();

    
}


interface SkillSearchMapProps {

}

function SkillSearchMap() {
    const mapOptions = {

    }

    return (
        <div>
            <MapContainer style={{ height: "400px", width: "50%" }} 
                center={[39.422962, -77.418918]} zoom={6}>
                <TileLayer 
                        attribution='&copy; 
                            <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
