import React from 'react';
import Map from 'react-map-gl';
import MapMarker from './map-maker';

interface MapContainerProps {
  longitude: number;
  latitude: number;
  zoom: number;
}

const MapContainer: React.FC<MapContainerProps> = ({ longitude, latitude, zoom }) => {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
      initialViewState={{
        longitude,
        latitude,
        zoom,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      interactive={false}
      reuseMaps
    >
      <MapMarker longitude={longitude} latitude={latitude} />
    </Map>
  );
};

export default MapContainer;
