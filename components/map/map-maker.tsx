import React from 'react';
import { Marker } from 'react-map-gl';

interface MapMarkerProps {
  longitude: number;
  latitude: number;
}

const MapMarker: React.FC<MapMarkerProps> = ({ longitude, latitude }) => {
  return (
    <Marker longitude={longitude} latitude={latitude}>
      <div className="relative">
        {/* Main circle */}
        <div className="w-4 h-4 bg-blue-500 rounded-full" />
        {/* Inner pulse */}
        <div className="absolute -inset-2 bg-blue-500/50 rounded-full animate-ping" />
        {/* Outer pulse */}
        <div className="absolute -inset-4 bg-blue-500/30 rounded-full animate-pulse" />
      </div>
    </Marker>
  );
};

export default MapMarker;
