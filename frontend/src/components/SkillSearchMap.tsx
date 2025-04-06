import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import L from "leaflet";
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


class InfoControl extends L.Control {
    private _div: HTMLDivElement | null = null;
  
    constructor(opts?: L.ControlOptions) {
        super({ position: 'topright', ...opts });
    }
  
    onAdd(map: L.Map) {
        this._div = L.DomUtil.create('div', 'info'); 
        this.update();
        return this._div;
    }
  
    // Update info control based on properties of feature
    update(props?: {countyName: string, stateCode: string, skillName: string}) {
        if (!this._div) return;
        this._div.innerHTML = `
            <h4>In-Demand Skills</h4>
            ${props
                ? `<b>${props.countyName}, ${props.stateCode}</b><br/>${props.skillName}`
                : 'Hover over a county'
            }
        `;
    }
}

interface ChoroplethProps {
    geoData: GeoJSON.FeatureCollection
}

function Choropleth({ geoData }: ChoroplethProps) {
    console.log("Re-rendering choropleth layer");

    const map = useMap();
    const infoControlRef = useRef<InfoControl | null>(null);

    useEffect(() => {
        const info = new InfoControl();
        info.addTo(map);
        infoControlRef.current = info;
        // Cleanup on unmount
        return () => {
            map.removeControl(info);
        };
    }, [map]);

    function style(feature: GeoJSON.Feature | undefined) {
        if (!feature || !feature.properties) {
            // Return empty dictionary if feature is undefined
            return {};
        }

        return {
            fillColor: mapSkillToColor(feature.properties.SKILL),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "5",
            fillOpacity: 0.75,
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

            if (!feature || !feature.properties) {
                infoControlRef.current?.update();
            } else {
                infoControlRef.current?.update({
                    countyName: feature.properties.NAME,
                    stateCode: feature.properties.STATECODE,
                    skillName: feature.properties.SKILL
                });
            }
        }

        function resetHighlight(e: Leaflet.LayerEvent) {
            let currentLayer = e.target;

            // Reset layer's style back to the default
            currentLayer.setStyle(style(feature))

            currentLayer.bringToFront();

            infoControlRef.current?.update();
        }

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        })
    }

    return (
        <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
    )
}

interface SkillSearchMapProps {
    stateSkills: StateSkillData[],
}

function SkillSearchMap({ stateSkills }: SkillSearchMapProps) {
    console.log("Re-rendering map component");

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

        // Get data on current state
        const currentStateData = stateSkills[
            stateSkills.findIndex(item => item.stateData.stateCode === stateCode)
        ];
        
        // Get data on the current county
        const county = currentStateData.countyData[
            currentStateData.countyData.findIndex(item => item.countyName === countyName)
        ];

        // Add skill name to each GeoJSON property
        const properties = {
            NAME: countyName,
            STATECODE: stateCode,
            SKILL: county.skillName
        }

        // Add 
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
                <Choropleth geoData={geoData}/>
                <InnerMap bounds={getBounds()}/>
                {/* <div 
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
                </div> */}
                {/* <InfoControl /> */}
            </MapContainer>
        </div>
    )
}

export default SkillSearchMap;
