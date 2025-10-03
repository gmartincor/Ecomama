"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useEffect } from "react";

type CommunityMapProps = {
  center: LatLngExpression;
  zoom?: number;
  markers?: Array<{
    id: string;
    position: LatLngExpression;
    name: string;
    description?: string;
  }>;
  onMarkerClick?: (id: string) => void;
  className?: string;
};

const DEFAULT_ZOOM = 13;

export const CommunityMap = ({
  center,
  zoom = DEFAULT_ZOOM,
  markers = [],
  onMarkerClick,
  className = "h-96 w-full rounded-lg",
}: CommunityMapProps) => {
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

  return (
    <MapContainer center={center} zoom={zoom} className={className} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} eventHandlers={{
          click: () => onMarkerClick?.(marker.id),
        }}>
          <Popup>
            <div className="text-sm">
              <h3 className="font-semibold">{marker.name}</h3>
              {marker.description && <p className="text-muted-foreground">{marker.description}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
