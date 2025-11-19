"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapEvent, MapListing } from "../types";

type GlobalMapProps = {
  events: MapEvent[];
  listings: MapListing[];
  onNavigateToEvent?: (eventId: string) => void;
  onNavigateToListing?: (listingId: string) => void;
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
  onNavigateToEvent,
  onNavigateToListing,
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
        
        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div style="flex: 1;">
                <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0;">${event.title}</h3>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">📅 Evento</p>
              </div>
            </div>
            <p style="font-size: 13px; margin: 0 0 12px 0; color: #374151;">
              ${event.description.substring(0, 150)}${event.description.length > 150 ? '...' : ''}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
              <span style="color: #6b7280;">👤 ${event.author.name}</span>
              <button 
                onclick="window.navigateToEvent('${event.id}')"
                style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;"
              >
                Ver Evento
              </button>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, { maxWidth: 300 });
        markersLayerRef.current.addLayer(marker);
      });

      filteredListings.forEach((listing) => {
        if (!markersLayerRef.current) return;

        const marker = L.marker([listing.latitude, listing.longitude], { icon: LISTING_ICON });
        
        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div style="flex: 1;">
                <h3 style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0;">${listing.title}</h3>
                <p style="font-size: 12px; color: #6b7280; margin: 0;">📦 Anuncio</p>
              </div>
            </div>
            <p style="font-size: 13px; margin: 0 0 12px 0; color: #374151;">
              ${listing.description.substring(0, 150)}${listing.description.length > 150 ? '...' : ''}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
              <span style="color: #6b7280;">👤 ${listing.author.name}</span>
              <button 
                onclick="window.navigateToListing('${listing.id}')"
                style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;"
              >
                Ver Anuncio
              </button>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, { maxWidth: 300 });
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

  }, [isMapReady, events, listings, onNavigateToEvent, onNavigateToListing]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).navigateToEvent = (eventId: string) => {
        onNavigateToEvent?.(eventId);
      };
      (window as any).navigateToListing = (listingId: string) => {
        onNavigateToListing?.(listingId);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).navigateToEvent;
        delete (window as any).navigateToListing;
      }
    };
  }, [onNavigateToEvent, onNavigateToListing]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};
