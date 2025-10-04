"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { geocodeAddress, type StructuredAddress } from "../services/geocodingService";
import type { GeocodingResult } from "../types";

type ManualAddressFormProps = {
  onAddressGeocoded: (location: GeocodingResult) => void;
};

export function ManualAddressForm({ onAddressGeocoded }: ManualAddressFormProps) {
  const [formData, setFormData] = useState<StructuredAddress>({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.city || !formData.country) {
      setError("Ciudad y país son obligatorios");
      return;
    }

    setIsGeocoding(true);
    setError(null);

    try {
      const result = await geocodeAddress(formData);
      onAddressGeocoded(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar la dirección");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleChange = (field: keyof StructuredAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="street">Calle y número</Label>
        <Input
          id="street"
          type="text"
          placeholder="Calle Principal, 123"
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            Ciudad <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="Madrid"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Código postal</Label>
          <Input
            id="postalCode"
            type="text"
            placeholder="28001"
            value={formData.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">
          País <span className="text-destructive">*</span>
        </Label>
        <Input
          id="country"
          type="text"
          placeholder="España"
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isGeocoding} className="w-full">
        {isGeocoding ? "Localizando..." : "Localizar en el mapa"}
      </Button>
    </form>
  );
}
