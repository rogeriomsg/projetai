import React, { SyntheticEvent, useEffect, useState, } from "react";
import { Modal, Button, Grid, GridCol, ActionIcon } from "@mantine/core";
import { GoogleMap,  Marker, useJsApiLoader } from "@react-google-maps/api";
import style1 from "./stylesMaps";
import { IconMap2 } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";

interface MapModalProps {
  title?:string
  pointDefault?: { lat : number ; lng:number} | null
  centerDefault?: { lat : number ; lng:number} | null
  zoom?: number
  onSetPoint?: (point: { lat:number; lng: number }) => void ;
  changePoint?:boolean
}

const containerStyle = {
    width: '100%',
    height: '500px',
  };
  
  const center = {
    lat: -15.783579727102195, // Latitude de exemplo (São Paulo)
    lng: -47.93393761657747, // Longitude de exemplo (São Paulo)
  };


const MapModalGetSinglePoint: React.FC<MapModalProps> = ({ title,  onSetPoint, centerDefault = center, pointDefault ,zoom = 16, changePoint = true}) => {
    const [marker, setMarker] = useState<{ lat: number; lng: number}[]>([]);
    const [opened, setOpened] = useState(false);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyC1l1lxyBRn6Jfm7EQkoeCv7auuleXsnmM", // Substitua pela sua API Key
    });

    const handleSave = () => {      
      if(marker.length>0 && onSetPoint)
        onSetPoint(marker[0])
      setOpened(false);
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {  
        if(!changePoint)  return ;     
        if (event.latLng) {            
            const marker = {lat:event.latLng?.lat(), lng: event.latLng?.lng()}            
            //criar apenas um
            setMarker( [marker] ) 
        } 
    };  
    useEffect(()=>{
      //alert(JSON.stringify(defaultPoint))
      setMarker(pointDefault? [pointDefault] : [] )
      changePoint = changePoint || true ;
    },[])  
   


    return (
      <>
        <ActionIcon 
          size="xl" 
          onClick={() => setOpened(true)}
        >
          <IconMap2  size={30} stroke={1.5} />
        </ActionIcon>         
        <Modal
          title={title || "Selecione um ponto no mapa"}
          opened={opened}
          onClose={() =>setOpened(false)}
          radius={15}
          size="xl"
          withCloseButton={false}
          centered 
          styles={{
            root: { backgroundColor: 'red' },
            inner: { fontSize: 20 },
          }}
        >
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={ pointDefault || centerDefault || center} 
              zoom={ zoom}
              onClick={handleMapClick}
              options={{
                streetViewControl: false, 
                styles: style1, // Insira aqui o JSON de estilo do mapa            
              }}
            >
                { marker.map((marker)=>
                    <>
                      <Marker 
                        key={randomId()}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        animation={google.maps.Animation.DROP} // Ativa a animação de "cair"
                      >                
                      </Marker>
                    </>
                )}
            </GoogleMap>
          ) : (
            <p>Carregando mapa...</p>
          )}
          <Grid mt="lg" justify="space-between" align="center">
            <GridCol span={2}>
              <Button color="red" onClick={() => setOpened(false)}>Cancelar</Button>
            </GridCol>
            <GridCol span={3}>
              <Button onClick={handleSave}>Salvar e Fechar</Button>
            </GridCol>
          </Grid>
        </Modal>
      </>      
    );
};
export default MapModalGetSinglePoint;
