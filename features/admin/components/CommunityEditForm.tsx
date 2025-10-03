"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import type { Community } from "@prisma/client";
import type { UpdateCommunityData } from "../types";

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
      [name]: name === "latitude" || name === "longitude" ? parseFloat(value) : value,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country">País</Label>
          <Input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitud</Label>
            <Input
              id="latitude"
              name="latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={handleChange}
              required
              min={-90}
              max={90}
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitud</Label>
            <Input
              id="longitude"
              name="longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={handleChange}
              required
              min={-180}
              max={180}
            />
          </div>
        </div>

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
