import type { GeocodingResult, LocationCoordinates } from "../types";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const HEADERS = {
  "User-Agent": "Ecomama-Platform/1.0",
};

type NominatimSearchResult = {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
};

type NominatimReverseResult = {
  display_name: string;
  address: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
};

const extractCity = (address: NominatimSearchResult["address"] | NominatimReverseResult["address"]): string => {
  return address.city || address.town || address.village || "";
};

const buildGeocodingResult = (
  displayName: string,
  lat: string,
  lon: string,
  address: NominatimSearchResult["address"] | NominatimReverseResult["address"]
): GeocodingResult => ({
  displayName,
  latitude: parseFloat(lat),
  longitude: parseFloat(lon),
  address: address.road || "",
  city: extractCity(address),
  country: address.country || "",
});

export const searchLocation = async (query: string): Promise<GeocodingResult[]> => {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "5",
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error("Geocoding search failed");
  }

  const data: NominatimSearchResult[] = await response.json();

  return data.map((result) =>
    buildGeocodingResult(result.display_name, result.lat, result.lon, result.address)
  );
};

export const reverseGeocode = async ({ latitude, longitude }: LocationCoordinates): Promise<GeocodingResult> => {
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    format: "json",
    addressdetails: "1",
  });

  const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
    headers: HEADERS,
  });

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  const data: NominatimReverseResult & { lat: string; lon: string } = await response.json();

  return buildGeocodingResult(data.display_name, data.lat, data.lon, data.address);
};
