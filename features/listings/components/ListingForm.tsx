import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit({
        type,
        title: title.trim(),
        description: description.trim(),
      });
    } catch (error) {
      setErrors({ submit: "Error al guardar. Intenta nuevamente." });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <span className="text-3xl">{typeIcon}</span>
          <div>
            <h3 className="font-semibold text-lg">{typeLabel}</h3>
            <p className="text-sm text-gray-600">
              {type === "OFFER" 
                ? "Productos o servicios que ofreces" 
                : "Productos o servicios que necesitas"}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/5000 caracteres
          </p>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Publicar"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
