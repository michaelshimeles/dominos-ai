"use client"
import React from 'react';
import MapContainer from './map-container';

interface MapProps {
  longitude: number;
  latitude: number;
  zoom: number;
}

const Map: React.FC<MapProps> = ({ longitude, latitude, zoom }) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        longitude={longitude}
        latitude={latitude}
        zoom={zoom}
      />
    </div>
  );
};

export default Map;
