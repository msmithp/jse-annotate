import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import counties from "../geodata/counties.json";
import { StateSkillData } from "../static/types";
import { Choropleth, MapBoundsControl } from ".";


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
                <MapBoundsControl geoData={geoData}/>
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
