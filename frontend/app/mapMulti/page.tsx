"use client"
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -23.55052, // São Paulo
  lng: -46.633308,
};

const MapWithColoredMarkers: React.FC = () => {
  const [markers, setMarkers] = useState<
    { id: number; lat: number; lng: number; isActive: boolean }[]
  >([]);
  const [nextId, setNextId] = useState(1);

  // Adiciona um novo marcador ao clicar no mapa
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const marker = {
        id: nextId,
        lat: event.latLng?.lat(),
        lng: event.latLng?.lng(),
        isActive: false, // Inicialmente o marcador não está ativo
      }
      setMarkers((prev) => [
        ...prev,
        marker
      ]);
      setNextId((prev) => prev + 1);
    }
  };

  // Alterna a cor do marcador ao clicar
  const handleMarkerClick = (id: number) => {
    setMarkers((prev) =>
      prev.map((marker) =>
        marker.id === id
          ? { ...marker, isActive: !marker.isActive } // Alterna o estado "isActive"
          : marker
      )
    );
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyC1l1lxyBRn6Jfm7EQkoeCv7auuleXsnmM">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => handleMarkerClick(marker.id)} // Altera a cor ao clicar
            icon={{
              path: google.maps.SymbolPath.CIRCLE, // Formato do marcador (círculo)
              scale: 10, // Tamanho
              fillColor: marker.isActive ? "red" : "blue", // Cor dinâmica
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithColoredMarkers;