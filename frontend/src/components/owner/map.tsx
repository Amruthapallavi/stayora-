import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import * as L from "leaflet";
import axios from "axios";

interface MapProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number };
}

const LocationMarker = ({
  onSelect,
}: {
  onSelect: (location: { lat: number; lng: number }) => void;
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
    },
  });

  return null;
};

const FlyToLocation = ({ location }: { location: { lat: number; lng: number } }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13);
    }
  }, [location, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ onLocationSelect, selectedLocation }) => {
  const defaultPosition = { lat: 20.5937, lng: 78.9629 };
  const [searchInput, setSearchInput] = useState("");
  const [flyLocation, setFlyLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    try {
      const response = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchInput,
          format: "json",
        },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setFlyLocation(newLocation); // fly to this location
      } else {
        alert("Location not found");
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          type="text"
          placeholder="Enter location..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-[#b68451]  text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <MapContainer
        center={selectedLocation || defaultPosition}
        zoom={5}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {selectedLocation && (
          <Marker
            position={selectedLocation}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          />
        )}

        {flyLocation && <FlyToLocation location={flyLocation} />}
        <LocationMarker onSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default Map;
