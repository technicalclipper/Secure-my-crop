"use client";

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationCoords {
  lat: number | null;
  lng: number | null;
  address: string;
}

interface MapComponentProps {
  onLocationSelect: (coords: LocationCoords) => void;
  initialLocation?: string;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (coords: LocationCoords) => void }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const coords = { lat, lng, address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}` };
      onLocationSelect(coords);
    },
  });
  return null;
}

// Component to handle map navigation
function MapController({ 
  center, 
  zoom 
}: { 
  center: [number, number]; 
  zoom: number; 
}) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

export default function MapComponent({ onLocationSelect, initialLocation }: MapComponentProps) {
  const [searchQuery, setSearchQuery] = useState(initialLocation || '');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [locationCoords, setLocationCoords] = useState<LocationCoords>({
    lat: null,
    lng: null,
    address: ''
  });
  const [mapKey, setMapKey] = useState(0); // Force re-render when needed
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default center (India)
  const [mapZoom, setMapZoom] = useState(5);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Mock geocoding - in real implementation, this would call a geocoding service
    const mockLocations: { [key: string]: { lat: number; lng: number; address: string } } = {
      'chennai': { lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu, India' },
      'mumbai': { lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra, India' },
      'delhi': { lat: 28.7041, lng: 77.1025, address: 'Delhi, India' },
      'bangalore': { lat: 12.9716, lng: 77.5946, address: 'Bangalore, Karnataka, India' },
      'hyderabad': { lat: 17.3850, lng: 78.4867, address: 'Hyderabad, Telangana, India' },
      'kolkata': { lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal, India' },
      'pune': { lat: 18.5204, lng: 73.8567, address: 'Pune, Maharashtra, India' },
      'ahmedabad': { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad, Gujarat, India' }
    };

    const searchLower = searchQuery.toLowerCase();
    const foundLocation = Object.entries(mockLocations).find(([key]) => 
      key.includes(searchLower) || searchLower.includes(key)
    );

    if (foundLocation) {
      const [, coords] = foundLocation;
      setLocationCoords(coords);
      setManualLat(coords.lat.toString());
      setManualLng(coords.lng.toString());
      onLocationSelect(coords);
      
      // Move map to the searched location
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(12); // Zoom in closer for city view
    } else {
      // If not found in mock data, just use the search query as address
      const coords = { lat: null, lng: null, address: searchQuery };
      setLocationCoords(coords);
      onLocationSelect(coords);
    }
  };

  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      const coords = { lat, lng, address: `Coordinates: ${lat}, ${lng}` };
      setLocationCoords(coords);
      onLocationSelect(coords);
      
      // Move map to the entered coordinates
      setMapCenter([lat, lng]);
      setMapZoom(10);
    }
  };

  const handleLocationSelect = (coords: LocationCoords) => {
    setLocationCoords(coords);
    setManualLat(coords.lat?.toString() || '');
    setManualLng(coords.lng?.toString() || '');
    onLocationSelect(coords);
    
    // Update map center when clicking on map
    if (coords.lat && coords.lng) {
      setMapCenter([coords.lat, coords.lng]);
      setMapZoom(10);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative">
        <div className="w-full h-64 border border-gray-300 rounded-md overflow-hidden">
          <MapContainer
            key={mapKey}
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            {/* OpenStreetMap tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Map controller for programmatic navigation */}
            <MapController center={mapCenter} zoom={mapZoom} />
            
            {/* Map click handler */}
            <MapClickHandler onLocationSelect={handleLocationSelect} />
            
            {/* Marker for selected location */}
            {locationCoords.lat && locationCoords.lng && (
              <Marker 
                position={[locationCoords.lat, locationCoords.lng]} 
                icon={customIcon}
              >
                <Popup>
                  <div>
                    <strong>Selected Location</strong><br />
                    {locationCoords.address}<br />
                    Lat: {locationCoords.lat.toFixed(6)}<br />
                    Lng: {locationCoords.lng.toFixed(6)}
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
        {/* Map overlay with instructions */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600 shadow z-10">
          Click to pin location
        </div>
      </div>
      
      {/* Location Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a city (e.g., Chennai, Mumbai, Delhi)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Manual Coordinates Input */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            placeholder="e.g., 13.0827"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            placeholder="e.g., 80.2707"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleManualCoordinates}
        className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
      >
        Set Coordinates
      </button>
      
      {/* Coordinates Display */}
      {locationCoords.lat && locationCoords.lng && (
        <div className="p-3 bg-green-50 rounded-md">
          <p className="text-sm text-green-700">
            <strong>Coordinates:</strong> {locationCoords.lat.toFixed(6)}, {locationCoords.lng.toFixed(6)}
          </p>
          {locationCoords.address && (
            <p className="text-sm text-green-700 mt-1">
              <strong>Address:</strong> {locationCoords.address}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 