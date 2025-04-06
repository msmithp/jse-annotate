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
        if (!this._div) return;
        this._div.innerHTML = `
            <h4 style="margin: 0 0 0px">In-Demand Skills</h4>
            ${props
                ? `${props.countyName}, ${props.stateCode}<br/><b>${props.skillName}</b><br/>${props.numJobs} jobs`
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
