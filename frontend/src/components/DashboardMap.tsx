import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { StateDensityData } from "src/static/types";
import { DensityMap, MapBoundsControl, Dropdown } from "../components";


interface DashboardMapProps {
    stateDensity: StateDensityData,
}

function DashboardMap({ stateDensity } : DashboardMapProps) {
    let processedFeatures = [];

    for (let i = 0; i < counties.features.length; i++) {
        const feature = counties.features[i];
        const stateCode = feature.properties.STATECODE;

        // Filter out all counties not in state
        if (stateCode !== stateDensity.stateData.stateCode) {
            continue;
        }

        // FIPS code of current county (e.g., "24021")
        const fips = feature.properties.GEOID;

        // Data on county
        const county = stateDensity.countyData[
            stateDensity.countyData.findIndex(item => item.countyFips === fips)
        ];

        const properties = {
            NAME: county.countyName,
            STATECODE: stateDensity.stateData.stateCode,
            COUNTYFIPS: fips,
            SKILL: stateDensity.skillData.skillName,
            JOBS: county.numJobs,
            DENSITY: county.density
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
            <MapContainer zoom={6} className="dashboardMap">
                <TileLayer 
                        attribution='&copy; 
                            <a href="https://www.openstreetmap.org/copyright">
                            OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DensityMap geoData={geoData} skill={stateDensity.skillData} />
                <MapBoundsControl geoData={geoData} />
            </MapContainer>
        </div>
    )
}

export default DashboardMap;
