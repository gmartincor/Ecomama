"use client";

import { useState, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { searchLocation, reverseGeocode } from "../services/geocodingService";
import { ManualAddressForm } from "./ManualAddressForm";
import type { GeocodingResult, LocationCoordinates } from "../types";

type LocationPickerProps = {
  initialPosition?: LatLngExpression;
  onLocationSelect: (location: GeocodingResult) => void;
  className?: string;
};

const DEFAULT_CENTER: LatLngExpression = [40.4168, -3.7038];
const DEFAULT_ZOOM = 6;
const LOCATION_ZOOM = 15;

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

const MapController = ({ center, zoom }: { center: LatLngExpression; zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
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
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "manual">("map");

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
    setMapZoom(LOCATION_ZOOM);
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

  const handleManualAddressGeocoded = (result: GeocodingResult) => {
    setSelectedPosition([result.latitude, result.longitude]);
    setMapZoom(LOCATION_ZOOM);
    onLocationSelect(result);
    setActiveTab("map");
  };

  return (
    <div className="space-y-4">
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "map"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Buscar en mapa
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "manual"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Introducir dirección
        </button>
      </div>

      {activeTab === "map" ? (
        <>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar dirección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching} type="button">
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-4 py-2 hover:bg-muted border-b border-border last:border-b-0"
                >
                  <div className="text-sm font-medium">{result.displayName}</div>
                  <div className="text-xs text-muted-foreground">
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
            <MapController center={selectedPosition} zoom={mapZoom} />
          </MapContainer>
        </>
      ) : (
        <div className="py-4">
          <ManualAddressForm onAddressGeocoded={handleManualAddressGeocoded} />
        </div>
      )}
    </div>
  );
};
