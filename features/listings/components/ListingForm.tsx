import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { AddressInput } from "@/components/ui/AddressInput";
import { Alert } from "@/components/ui/Alert";
import type { ListingType, CreateListingData, Listing } from "../types";

type ListingFormProps = {
  type: ListingType;
  initialData?: Listing;
  onSubmit: (data: CreateListingData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
};

export const ListingForm = ({
  type,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: ListingFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<{
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  }>({
    latitude: initialData?.latitude ?? undefined,
    longitude: initialData?.longitude ?? undefined,
    city: initialData?.city ?? undefined,
    country: initialData?.country ?? undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLocationChange = (locationData: { latitude: number; longitude: number; city?: string; country?: string } | null) => {
    if (locationData) {
      setLocation(locationData);
    } else {
      setLocation({});
    }
  };

  const typeLabel = type === "OFFER" ? "Oferta" : "Demanda";
  const typeIcon = type === "OFFER" ? "🌾" : "🛒";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (title.length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    }

    if (!address.trim()) {
      newErrors.address = "La ubicación es requerida";
    }

    if (!location.latitude || !location.longitude) {
      newErrors.address = "Debes buscar y confirmar la ubicación antes de publicar";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        type,
        title: title.trim(),
        description: description.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        city: location.city,
        country: location.country,
      });
    } catch (error) {
      setErrors({ submit: "Error al guardar. Intenta nuevamente." });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <span className="text-3xl">{typeIcon}</span>
          <div>
            <h3 className="font-semibold text-lg">{typeLabel}</h3>
            <p className="text-sm text-muted-foreground">
              {type === "OFFER" 
                ? "Productos o servicios que ofreces" 
                : "Productos o servicios que necesitas"}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Título
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Título de tu ${typeLabel.toLowerCase()}`}
            error={errors.title}
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Descripción
          </label>
          <Textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder={`Describe en detalle tu ${typeLabel.toLowerCase()}...`}
            rows={8}
            error={errors.description}
            maxLength={5000}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {description.length}/5000 caracteres
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Ubicación <span className="text-red-500">*</span>
          </label>
          <AddressInput
            value={address}
            onChange={setAddress}
            onLocationChange={handleLocationChange}
            placeholder="Ej: Madrid, España o Calle Gran Vía 1, Madrid"
            error={errors.address}
            disabled={isLoading}
            required={true}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Escribe tu ubicación y presiona el botón 🔍 o Enter para confirmar
          </p>
        </div>

        {errors.submit && (
          <Alert variant="destructive">{errors.submit}</Alert>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Publicar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
