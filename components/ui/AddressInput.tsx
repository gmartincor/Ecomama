import { useState, useEffect, useRef } from "react";
import { Input } from "./Input";
import { Button } from "./Button";

type GeocodingResult = {
  lat: string;
  lon: string;
  display_name: string;
};

type LocationData = {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  displayName?: string;
};

type AddressInputProps = {
  value: string;
  onChange: (value: string) => void;
  onLocationChange?: (location: LocationData | null) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  required?: boolean;
};

export const AddressInput = ({
  value,
  onChange,
  onLocationChange,
  placeholder = "Ej: Madrid, España o Calle Gran Vía 1, Madrid",
  error,
  disabled = false,
  maxLength = 200,
  required = false,
}: AddressInputProps) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleGeocode = async () => {
    if (!value.trim()) {
      setGeocodingError(required ? "La ubicación es requerida" : null);
      setLocation(null);
      onLocationChange?.(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsGeocoding(true);
      setGeocodingError(null);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Ecomama-App',
          },
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Error en la geocodificación");
      }

      const results: GeocodingResult[] = await response.json();

      if (results.length > 0) {
        const result = results[0];
        const addressParts = result.display_name.split(', ');
        
        const locationData: LocationData = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          city: addressParts.length > 2 ? addressParts[addressParts.length - 3] : addressParts[0],
          country: addressParts.length > 0 ? addressParts[addressParts.length - 1] : undefined,
          displayName: result.display_name,
        };

        setLocation(locationData);
        onLocationChange?.(locationData);
      } else {
        setGeocodingError("No se encontró la ubicación. Intenta ser más específico (ciudad, país)");
        setLocation(null);
        onLocationChange?.(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      setGeocodingError("Error al buscar la ubicación");
      setLocation(null);
      onLocationChange?.(null);
    } finally {
      setIsGeocoding(false);
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setLocation(null);
              setGeocodingError(null);
            }}
            placeholder={placeholder}
            error={error || geocodingError || undefined}
            disabled={disabled}
            maxLength={maxLength}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleGeocode();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleGeocode}
          disabled={disabled || isGeocoding || !value.trim()}
        >
          {isGeocoding ? "..." : "🔍"}
        </Button>
      </div>
      
      {isGeocoding && (
        <p className="text-xs text-muted-foreground">Buscando ubicación...</p>
      )}
      
      {location && !isGeocoding && (
        <div className="text-xs text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400 p-2 rounded">
          ✓ Ubicación encontrada: {location.displayName}
        </div>
      )}
    </div>
  );
};
