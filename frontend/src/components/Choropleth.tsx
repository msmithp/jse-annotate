import { useEffect, useRef } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import Leaflet from "leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { mapSkillToColor } from "src/static/utils";

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
    update(props?: {countyName: string, stateCode: string, skillName: string, numJobs: number}) {
        if (!this._div) {
            return;
        }

        // Set text in info box
        let body = "";
        if (!props) {
            // Nothing being hovered over
            body = "Hover over a county";
        } else {
            // County is being hovered over
            const countyName = `${props.countyName}, ${props.stateCode}`;
            if (props.numJobs === 0) {
                // No jobs in this county
                body = countyName + `<br/>No jobs found`;
            } else if (props.numJobs === 1) {
                body = countyName + `<br/>
                <b>${props.skillName}</b><br/>
                ${props.numJobs} job`;
            } else {
                body = countyName + `<br/>
                <b>${props.skillName}</b><br/>
                ${props.numJobs} jobs`;
            }
        }

        this._div.innerHTML = "<h4 style=\"margin: 0 0 0px\">In-Demand Skills</h4>" + body;
    }
}

interface ChoroplethProps {
    geoData: GeoJSON.FeatureCollection
}

function Choropleth({ geoData }: ChoroplethProps) {
    console.log("Re-rendering choropleth layer");
    console.log(geoData);

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
                    skillName: feature.properties.SKILL,
                    numJobs: feature.properties.JOBS
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
        <GeoJSON
            key={JSON.stringify(geoData)}
            data={geoData}
            style={style}
            onEachFeature={onEachFeature}
        />
    )
}

export default Choropleth;
