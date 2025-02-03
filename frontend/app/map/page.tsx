'use client'
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '800px',
};

const center = {
  lat: -23.55052, // Latitude de exemplo (São Paulo)
  lng: -46.633308, // Longitude de exemplo (São Paulo)
};

const MyMap = () => {
  return (
    <LoadScript 
        googleMapsApiKey="AIzaSyC1l1lxyBRn6Jfm7EQkoeCv7auuleXsnmM"
        libraries={['places','marker','maps']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={18}
      >
        {/* Exemplo de marcador */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMap;