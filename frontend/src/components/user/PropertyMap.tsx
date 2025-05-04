import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PropertyMap = ({ latitude, longitude, propertyTitle }: { latitude: number; longitude: number; propertyTitle: string }) => {
  return (
    <div>
<MapContainer
  center={[latitude, longitude]}
  zoom={14}
  style={{ height: '400px', width: '100%', zIndex: 0 }} // <-- here
>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[latitude, longitude]}
          icon={new L.Icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>{propertyTitle}</Popup>
        </Marker>
      </MapContainer>

      {/* Google Maps Link */}
      <div className="mt-4 text-center">
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-[#b68451] text-white rounded hover:bg-[#9e6f41] transition"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default PropertyMap;
