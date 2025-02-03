import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Modal, Button, Grid, GridCol } from "@mantine/core";
import { Icon123, Icon12Hours } from "@tabler/icons-react";

interface DataItem {
    id: string;
    name: string;
    available: boolean;
    lat: number;
    lng: number;
}

interface Props {
    title?: string | null
    labelButton?:string | null
    description?:string | null
    data: DataItem[];
    onSelectionChange: (selected: { id: string; name: string }[]) => void;
}

const MapModalGetMultiple: React.FC<Props> = ({ title,labelButton,description, data, onSelectionChange }) => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC1l1lxyBRn6Jfm7EQkoeCv7auuleXsnmM", // Substitua pela sua API Key
    });

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

//   const center = {
//     lat: data.length > 0 ? data[0].lat : 0,
//     lng: data.length > 0 ? data[0].lng : 0,  
//   }; 
  const center = {
    lat: -15.783597857799068,
    lng: -47.93383408528068,
  };

  const handleMarkerClick = (item: DataItem) => {
    if (!item.available) return; // Ignora marcadores não clicáveis

    setSelected((prevSelected) => {
      const alreadySelected = prevSelected.find((s) => s.id === item.id);

      

      if (alreadySelected) {
        // Desselecionar
        
        return prevSelected.filter((s) => s.id !== item.id);
      } else {
        // Selecionar
        return [...prevSelected, { id: item.id, name: item.name }];
      }
    });
  };

  const isSelected = (id: string) => selected.some((s) => s.id === id);

  const handleSave = () => {
    onSelectionChange(selected);
    setOpened(false);
  };

  return (
    <>
      <Button onClick={() => setOpened(true)}>{ labelButton || "Abrir Mapa"}</Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={ title || "Selecione os objetos"}
        keepMounted={true}
        withCloseButton={false}
        size="lg"
      >        
          
        {isLoaded ? (
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={18}
            options={{
                gestureHandling: "greedy",
                clickableIcons: false, // Ícones do Google não podem ser clicados
            }}
          >
            {data.map((item) => (
              <Marker
                key={item.id}
                position={{ lat: item.lat, lng: item.lng }}
                onClick={() => handleMarkerClick(item)}
                icon={
                    {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: isSelected(item.id)
                    ? "green"
                    : item.available
                    ? "blue"
                    : "gray",
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: "white",
                }}
              />
            ))}
          </GoogleMap>
        ) : (
            <p>Carregando mapa...</p>
        )}
        <Grid mt="lg" justify="space-between" align="center">
            <GridCol span={3}>
                <Button color="red" onClick={()=>setOpened(false)}>Cancelar</Button>
            </GridCol>
            <GridCol span={3}>
                <Button onClick={handleSave}>Salvar Seleção</Button>
            </GridCol>
        </Grid>
      </Modal>
    </>
  );
};

export default MapModalGetMultiple;
