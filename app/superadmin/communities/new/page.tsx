"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { LocationPicker } from "@/features/communities/components/LocationPicker";
import { UserSelector } from "@/features/superadmin/components/UserSelector";
import { createCommunitySchema } from "@/lib/validations/community";
import type { GeocodingResult } from "@/features/communities/types";

export default function NewCommunityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: 0,
    longitude: 0,
    address: "",
    city: "",
    country: "",
    adminId: "",
  });

  const handleLocationSelect = (location: GeocodingResult) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      city: location.city,
      country: location.country,
    }));
  };

  const handleAdminSelect = (userId: string) => {
    setFormData((prev) => ({ ...prev, adminId: userId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const validatedData = createCommunitySchema.parse(formData);

      const response = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create community");
      }

      router.push("/superadmin/communities");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Crear Nueva Comunidad</h1>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre de la Comunidad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Huerta Comunitaria Centro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe la comunidad..."
              className="w-full min-h-24 px-3 py-2 border rounded-md"
              required
            />
          </div>

          <UserSelector
            value={formData.adminId}
            onChange={handleAdminSelect}
          />

          <div className="space-y-2">
            <Label>
              Ubicación <span className="text-destructive">*</span>
            </Label>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              initialPosition={
                formData.latitude && formData.longitude
                  ? [formData.latitude, formData.longitude]
                  : undefined
              }
            />
          </div>

          {formData.city && (
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                <span className="font-semibold">Dirección:</span> {formData.address}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Ciudad:</span> {formData.city}
              </p>
              <p className="text-sm">
                <span className="font-semibold">País:</span> {formData.country}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Coordenadas:</span> {formData.latitude.toFixed(6)},{" "}
                {formData.longitude.toFixed(6)}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{error}</div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || !formData.adminId}>
              {isSubmitting ? "Creando..." : "Crear Comunidad"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
