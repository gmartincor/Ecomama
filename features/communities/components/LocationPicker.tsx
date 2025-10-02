"use client";

import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { searchLocation, reverseGeocode } from "../services/geocodingService";
import type { GeocodingResult, LocationCoordinates } from "../types";

type LocationPickerProps = {
  initialPosition?: LatLngExpression;
  onLocationSelect: (location: GeocodingResult) => void;
  className?: string;
};

const DEFAULT_CENTER: LatLngExpression = [40.4168, -3.7038];
const DEFAULT_ZOOM = 6;

const MapClickHandler = ({
  onLocationChange,
}: {
  onLocationChange: (coords: LocationCoordinates) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onLocationChange({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });
  return null;
};

export const LocationPicker = ({
  initialPosition = DEFAULT_CENTER,
  onLocationSelect,
  className = "h-96 w-full rounded-lg",
}: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<LatLngExpression>(initialPosition);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: GeocodingResult) => {
    setSelectedPosition([result.latitude, result.longitude]);
    onLocationSelect(result);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleMapClick = useCallback(async (coords: LocationCoordinates) => {
    setSelectedPosition([coords.latitude, coords.longitude]);
    try {
      const result = await reverseGeocode(coords);
      onLocationSelect(result);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  }, [onLocationSelect]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar dirección..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
            >
              <div className="text-sm font-medium">{result.displayName}</div>
              <div className="text-xs text-gray-500">
                {result.city}, {result.country}
              </div>
            </button>
          ))}
        </div>
      )}

      <MapContainer center={selectedPosition} zoom={DEFAULT_ZOOM} className={className}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={selectedPosition} />
        <MapClickHandler onLocationChange={handleMapClick} />
      </MapContainer>
    </div>
  );
};
