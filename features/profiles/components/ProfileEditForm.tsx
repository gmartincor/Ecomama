"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import type { ProfileInput } from "@/lib/validations/profile";

type ProfileEditFormProps = {
  initialData?: ProfileInput;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const ProfileEditForm = ({ initialData, onSuccess, onCancel }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState<ProfileInput>({
    bio: initialData?.bio || "",
    phone: initialData?.phone || "",
    location: initialData?.location || "",
    avatar: initialData?.avatar || "",
    isPublic: initialData?.isPublic ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/users/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bio">Biografía</Label>
          <textarea
            id="bio"
            value={formData.bio || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
            placeholder="Cuéntanos sobre ti..."
            className="w-full min-h-24 px-3 py-2 border rounded-md"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">{formData.bio?.length || 0}/500 caracteres</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+34 123 456 789"
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={formData.location || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="Ciudad, País"
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar">URL del Avatar</Label>
          <Input
            id="avatar"
            type="url"
            value={formData.avatar || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
            placeholder="https://ejemplo.com/avatar.jpg"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
            className="w-4 h-4"
          />
          <Label htmlFor="isPublic" className="cursor-pointer">
            Hacer perfil público para miembros de la comunidad
          </Label>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
  );
};
