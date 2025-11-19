"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapItem, MapEvent, MapListing } from "../types";

type GlobalMapProps = {
  events: MapEvent[];
  listings: MapListing[];
  onItemClick?: (item: MapItem) => void;
  center?: [number, number];
  zoom?: number;
};

const EVENT_ICON = L.divIcon({
  html: '<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📅</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const LISTING_ICON = L.divIcon({
  html: '<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">📦</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const GlobalMap = ({
  events,
  listings,
  onItemClick,
  center = [40.4168, -3.7038],
  zoom = 6,
}: GlobalMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      preferCanvas: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
      setIsMapReady(true);
    }, 100);

    return () => {
      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
        markersLayerRef.current.remove();
        markersLayerRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!isMapReady || !mapRef.current || !markersLayerRef.current || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const updateMarkers = () => {
      if (!markersLayerRef.current || !mapRef.current) return;

      markersLayerRef.current.clearLayers();

      const filteredEvents = events.filter(e => 
        e.latitude != null && 
        e.longitude != null && 
        !isNaN(e.latitude) && 
        !isNaN(e.longitude)
      );

      const filteredListings = listings.filter(l => 
        l.latitude != null && 
        l.longitude != null && 
        !isNaN(l.latitude) && 
        !isNaN(l.longitude)
      );

      filteredEvents.forEach((event) => {
        if (!markersLayerRef.current) return;

        const marker = L.marker([event.latitude, event.longitude], { icon: EVENT_ICON });
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${event.title}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${event.type}</p>
            <p style="font-size: 14px;">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
            ${event.location ? `<p style="font-size: 12px; margin-top: 8px;">📍 ${event.location}</p>` : ''}
            <p style="font-size: 12px; margin-top: 8px;">👤 ${event.author.name}</p>
          </div>
        `);
        
        if (onItemClick) {
          marker.on('click', () => onItemClick(event));
        }
        
        markersLayerRef.current.addLayer(marker);
      });

      filteredListings.forEach((listing) => {
        if (!markersLayerRef.current) return;

        const marker = L.marker([listing.latitude, listing.longitude], { icon: LISTING_ICON });
        
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">${listing.title}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${listing.type}</p>
            <p style="font-size: 14px;">${listing.description.substring(0, 100)}${listing.description.length > 100 ? '...' : ''}</p>
            ${listing.city ? `<p style="font-size: 12px; margin-top: 8px;">📍 ${listing.city}, ${listing.country}</p>` : ''}
            <p style="font-size: 12px; margin-top: 8px;">👤 ${listing.author.name}</p>
          </div>
        `);
        
        if (onItemClick) {
          marker.on('click', () => onItemClick(listing));
        }
        
        markersLayerRef.current.addLayer(marker);
      });

      const allPoints = [
        ...filteredEvents.map(e => [e.latitude, e.longitude] as [number, number]),
        ...filteredListings.map(l => [l.latitude, l.longitude] as [number, number]),
      ];

      if (allPoints.length > 0 && mapRef.current) {
        const bounds = L.latLngBounds(allPoints);
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50], 
          maxZoom: 12,
          animate: false 
        });
      }

      isUpdatingRef.current = false;
    };

    requestAnimationFrame(updateMarkers);

  }, [isMapReady, events, listings, onItemClick]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};
