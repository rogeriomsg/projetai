import React, { useState, Dispatch, SetStateAction, useRef } from "react";
import { Modal, Button } from "@mantine/core";
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from "@react-google-maps/api";
import style1 from "./stylesMaps";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void ;
  centerMap?: { lat : number ; lng:number} | null
  setCoordinates: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
}

const containerStyle = {
    width: '100%',
    height: '500px',
  };
  
  const defaultcenter = {
    lat: -15.783579727102195, // Latitude de exemplo (São Paulo)
    lng: -47.93393761657747, // Longitude de exemplo (São Paulo)
  };


const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose ,setCoordinates,centerMap}) => {
    const [markers, setMarkers] = useState<{ lat: number; lng: number; id: number }[]>([]);
    const [nextId, setNextId] = useState(1);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC1l1lxyBRn6Jfm7EQkoeCv7auuleXsnmM", // Substitua pela sua API Key
    });

    const handleMapClick = (event: google.maps.MapMouseEvent) => {        
        if (event.latLng) {
            setCoordinates({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            })
            const marker = {lat:event.latLng?.lat(), lng: event.latLng?.lng(),id:nextId}
            //criar mais de um
            setMarkers((prev)=>[
                ...prev,
                marker
            ])
            //criar apenas um
            setMarkers([
                marker
            ])  
            setNextId((prev) => prev + 1);
        } 
    };

    return (
    <Modal
        opened={isOpen}
        onClose={onClose}
        size="xl"
        withCloseButton
        centered 
    >
        {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerMap || defaultcenter}
          zoom={18}
          onClick={handleMapClick}

          options={{
            streetViewControl: false, 
            //disableDefaultUI: true, // Remove os controles padrão
            styles: style1, // Insira aqui o JSON de estilo do mapa            
          }}
        >
            {markers.map((marker) => (         
                <Marker 
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                animation={google.maps.Animation.DROP} // Ativa a animação de "cair"
                >                
                </Marker>
            ))}
        </GoogleMap>
      ) : (
        <p>Carregando mapa...</p>
      )}
      <div style={{ marginTop: "10px", textAlign: "right" }}>
        <Button mt="xl" onClick={onClose}>Salvar e Fechar</Button>
      </div>
    </Modal>
    );
};



export default MapModal;
