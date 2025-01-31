'use client'
import { MapComponent } from "@/components/map";
import { MapProvider } from "@/providers/map-provider";

export default function Map() {
  const center = {lat:-15.78357490519806,lng:-47.93394030140764}
  const handleMapClick = (e:google.maps.MapMouseEvent) => {
    
    alert( e.latLng?.toString() )
  };

  return (
    <MapProvider>
      
        <MapComponent center={center} zoom={18} onClick={handleMapClick}/>
    </MapProvider>
  );
}