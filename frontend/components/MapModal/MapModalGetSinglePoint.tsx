import React, { SyntheticEvent, useEffect, useState, } from "react";
import { Modal, Button, Grid, GridCol, ActionIcon, ActionIconProps } from "@mantine/core";
import { GoogleMap,  Marker, useJsApiLoader } from "@react-google-maps/api";
import style1 from "./stylesMaps";
import { IconMap2 } from "@tabler/icons-react";
import { randomId } from "@mantine/hooks";

export interface IMarker{
  available?:boolean | true
  selected?:boolean | false
  clickable?:boolean
  draggable?:boolean
  id:string
  name?:string 
  lat:number
  lng:number
}

interface MapModalProps {
  title?:string
  centerDefault?: { lat : number ; lng:number} | null
  zoom?: number
  dataMarkers?:IMarker[]
  onSelectionChange?: (selected: IMarker[]) => void | null;
}

const containerStyle = {
    width: '100%',
    height: '500px',
  };
  
  const center = {
    lat: -15.783579727102195, // Latitude de exemplo (São Paulo)
    lng: -47.93393761657747, // Longitude de exemplo (São Paulo)
  };


const MapModalGetSinglePoint: React.FC<MapModalProps> = ({ 
  title="",  
  centerDefault = center,
  zoom = 16, 
  dataMarkers = [],
  onSelectionChange
}) => {
    const [markers, setMarkers] = useState<IMarker[]>([]);
    const [selected, setSelected] = useState<IMarker[]>([]);
    const [opened, setOpened] = useState(false);
    const { isLoaded } = useJsApiLoader({
        //googleMapsApiKey: "AIzaSyC1l1lxyBRn6Jfm7EQkoeCv7auuleXsnmM", // Substitua pela sua API Key
        googleMapsApiKey: "", // Substitua pela sua API Key
    });

    const handleSave = () => {   
      onSelectionChange?.(selected);
      setOpened(false);
    };

    // const handleSave = () => {      
    //   if(markers.length>0 && onSetPoint)
    //     onSetPoint(markers[0])
    //   setOpened(false);
    // };

    // const handleMapClick = (event: google.maps.MapMouseEvent) => {  
    //     if(!changePoint)  return ;     
    //     if (event.latLng) {            
    //         const marker = {lat:event.latLng?.lat(), lng: event.latLng?.lng()} 
    //         setMarkers( [marker] ) 
    //     } 
    // }; 

    const handleMarkerClick = (item: IMarker) => {
      if (!item.available ) return; // Ignora marcadores não clicáveis

      setSelected((prevSelected) => {
        const alreadySelected = prevSelected.find((s) => s.id === item.id);  
        if (alreadySelected) {
          // Desselecionar          
          return prevSelected.filter((s) => s.id !== item.id);
        } else {
          // Selecionar
          return [...prevSelected, item ];
        }
      });
    };

    const handleMarkerDrag = (item: IMarker,event:google.maps.MapMouseEvent) => {
      setSelected((prevSelected) =>
        prevSelected.map((marker) =>
          marker.id === item.id && event.latLng
            ? { ...marker, lat: event.latLng.lat() , lng: event.latLng.lng() } // Atualiza lat e lng
            : marker // Mantém os outros itens inalterados
        )
      );
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.id === item.id && event.latLng
            ? { ...marker, lat: event.latLng.lat() , lng: event.latLng.lng() } // Atualiza lat e lng
            : marker // Mantém os outros itens inalterados
        )
      );
    }; 

    useEffect(()=>{
      setSelected(dataMarkers.filter((s) => s.selected ))
      setMarkers(dataMarkers)
    },[])

    const isSelected = (id: string) => selected.some((s) => s.id === id);

    return (
      <>       
        <ActionIcon 
          size="xl" 
          variant="subtle"
          onClick={() => setOpened(true)}
        >
          <IconMap2  style={{ width: '80%', height: '80%' }} stroke={1.5} />
        </ActionIcon>                 
        <Modal
          title={title}
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
              center={ centerDefault || center} 
              zoom={ zoom}
              //onClick={handleMapClick}
              options={{
                streetViewControl: false, 
                styles: style1, // Insira aqui o JSON de estilo do mapa            
              }}
            >
                { markers.map((marker)=>
                    <>
                      <Marker 
                        key={randomId()}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        //animation={google.maps.Animation.DROP} // Ativa a animação de "cair"
                        clickable={marker.clickable || true}
                        onClick={() => handleMarkerClick(marker)}
                        draggable={marker.draggable || false}
                        onDragEnd={(e)=>handleMarkerDrag(marker,e)}
                        icon={{
                          path: "M0 26.016q0 2.496 1.76 4.224t4.256 1.76h20q2.464 0 4.224-1.76t1.76-4.224v-20q0-2.496-1.76-4.256t-4.224-1.76h-1.12q1.824 2.048 2.56 4.672 0.544 0.576 0.544 1.344v20q0 0.832-0.576 1.408t-1.408 0.576h-20q-0.832 0-1.44-0.576t-0.576-1.408v-20q0-0.768 0.544-1.344 0.736-2.624 2.56-4.672h-1.088q-2.496 0-4.256 1.76t-1.76 4.256v20zM8 8q0 1.248 0.832 3.36t1.984 4.224 2.368 4.064 2.016 3.136l0.8 1.216q0.32-0.448 0.864-1.248t1.92-3.072 2.432-4.16 1.92-4.096 0.864-3.424q0-3.296-2.336-5.632t-5.664-2.368-5.664 2.368-2.336 5.632zM12 8q0-1.632 1.184-2.816t2.816-1.184 2.816 1.184 1.184 2.816-1.184 2.848-2.816 1.152-2.816-1.152-1.184-2.848z",
                          scale: 2,
                          fillColor: !marker.available
                            ? "gray"
                            : isSelected(marker.id)
                            ? "green"
                            : "blue",
                          fillOpacity: 0.5,
                          strokeWeight: 1,
                        }}
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
