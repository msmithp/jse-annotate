import L from "leaflet";
import { useMap } from "react-leaflet";

interface MapBoundsControlProps {
    geoData: GeoJSON.FeatureCollection
}

/** Inner map component for bounds fitting */
function MapBoundsControl({ geoData }: MapBoundsControlProps) {
    const map = useMap();
    const geojson = L.geoJson(geoData);
    map.fitBounds(geojson.getBounds());

    return null;
}

export default MapBoundsControl;
