import  {  useRef, useState } from 'react';

const Map = ({ 
  onLocationSelect, 
  selectedLocation 
}: { 
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number };
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string>('');
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const lat = 40.7 + ((y / rect.height) - 0.5) * 10;
    const lng = -74 + ((x / rect.width) - 0.5) * 20;
    
    onLocationSelect({ lat, lng });
  };
  
  return (
    <div className="mb-4">
      <div className="flex flex-col gap-4 mb-4">
        <label htmlFor="mapApiKey" className="block text-gray-700 font-semibold">
          Map API Key (for demonstration - not stored)
        </label>
        <input
          type="text"
          id="mapApiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your map API key (this is for demonstration only)"
          className="border w-full p-2 rounded-md focus:ring-2 focus:ring-golden"
        />
      </div>
      
      <div 
        ref={mapRef}
        onClick={handleClick}
        className="w-full h-64 bg-gray-100 rounded-md border border-gray-300 relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center p-4">
            <p className="text-gray-600 mb-2">
              This is a placeholder for the map. In a real app, integrate with Mapbox, Google Maps, or Leaflet.
            </p>
            <p className="text-gray-500 text-sm">
              Click anywhere to select a location (for demonstration).
            </p>
          </div>
        </div>
        
        {selectedLocation && (
          <div 
            className="absolute w-6 h-6 bg-red-500 rounded-full transform -translate-x-3 -translate-y-3 flex items-center justify-center"
            style={{ 
              left: `${((selectedLocation.lng + 74) / 20 + 0.5) * 100}%`, 
              top: `${((selectedLocation.lat - 40.7) / 10 + 0.5) * 100}%`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
      
      {selectedLocation && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default Map;
