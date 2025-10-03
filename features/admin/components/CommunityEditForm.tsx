import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/features/communities/components/LocationPicker";
import type { Community } from "@prisma/client";
import type { UpdateCommunityData } from "../types";
import type { GeocodingResult } from "@/features/communities/types";

interface CommunityEditFormProps {
  community: Community;
  onSubmit: (data: UpdateCommunityData) => Promise<void>;
  onCancel: () => void;
}

export function CommunityEditForm({
  community,
  onSubmit,
  onCancel,
}: CommunityEditFormProps) {
  const [formData, setFormData] = useState<UpdateCommunityData>({
    name: community.name,
    description: community.description,
    address: community.address,
    city: community.city,
    country: community.country,
    latitude: community.latitude,
    longitude: community.longitude,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la comunidad");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Editar Información de la Comunidad</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Nombre de la Comunidad</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
            rows={4}
          />
        </div>

        <div>
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

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
