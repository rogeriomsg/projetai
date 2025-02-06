/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap,Marker } from "@react-google-maps/api";
import { useState } from "react";



//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 15px 15px 15px',
};

const defaultMapCenter = {
    lat: -15.78356180519806,
    lng: -47.93394030140764
}

const defaultMapZoom = 18

const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'satellite',
};


const handleMapClick = (e:google.maps.MapMouseEvent) => {
    e.stop();
};
const handleOnLoad = (map:google.maps.Map) => {
    //alert("mapa carregou")
    map.data.addListener('click', (event:any)=>{
        var position = {lat: event.latLng.lat(), lng: event.latLng.lng()}
        alert(JSON.stringify(position))
        
    });
  };
  const onClickFeature = (event:any) => {
    alert(event.feature.getProperty('letter'));
    
  };

  const onLoad = (marker:any) => {
    alert(JSON.stringify(marker));
  };


function MapComponent({
    center = { lat: -15.78356180519806, lng: -47.93394030140764 }, 
    zoom = defaultMapZoom, options = defaultMapOptions, containerStyle = defaultMapContainerStyle, onClick = handleMapClick
}) {

    const [ id, setId ] = useState(0);
   const [ markers, setMarkers ] = useState([]);
   const [ drawMarker, setDrawMarker ] = useState(false);

   // add marker to Map
  const addMarker = (coords) => {
    setId((id)=>id+1);
    setMarkers((markers) => markers.concat([{coords, id}]) )
  }
    
    return (
        <>
        <button
        type="button"   
        style={{backgroundColor: drawMarker ? "green" : null}}     
        onClick={()=>{setDrawMarker(()=>!drawMarker)}}
      >ADD & DRAG</button>
      <button
        type="button"
        onClick={()=>setMarkers([])}
      >CLEAR MAP</button>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                options={options}
                onClick={onClick}
                onLoad={handleOnLoad}
            >               
            </GoogleMap>
        </>
    );
}



export { MapComponent };