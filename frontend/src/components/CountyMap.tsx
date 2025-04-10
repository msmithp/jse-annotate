import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { CountyMapData } from "src/static/types";
import { DensityMap, MapBoundsControl } from "../components";


interface CountyMapProps {
    mapData: CountyMapData,
}

function CountyMap({ mapData } : CountyMapProps) {
    let processedFeatures = [];

    for (let i = 0; i < counties.features.length; i++) {
        const feature = counties.features[i];
        const stateCode = feature.properties.STATECODE;

        // Filter out all counties not in state
        if (stateCode !== mapData.stateData.stateCode) {
            continue;
        }

        // FIPS code of current county (e.g., "24021")
        const fips = feature.properties.GEOID;

        // Data on county
        const county = mapData.countyData[
            mapData.countyData.findIndex(item => item.countyFips === fips)
        ];

        const properties = {
            NAME: county.countyName,
            STATECODE: mapData.stateData.stateCode,
            COUNTYFIPS: fips,
            SKILL: null,
            JOBS: 0,
            DENSITY: 0
        };

        processedFeatures.push({
            type: feature.type,
            properties: properties,
            geometry: feature.geometry
        });
    }

    const geoData = {
        type: counties.type,
        name: counties.name,
        crs: counties.crs,
        features: processedFeatures
    } as GeoJSON.FeatureCollection;

    return (
        <div>
            <div>
                <MapContainer style={{ height: "400px", width: "600px" }} zoom={6}>
                    <TileLayer 
                            attribution='&copy; 
                                <a href="https://www.openstreetmap.org/copyright">
                                OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DensityMap geoData={geoData} skill={null} />
                    <MapBoundsControl geoData={geoData} />
                </MapContainer>
            </div>
        </div>
    )
}

export default CountyMap;
