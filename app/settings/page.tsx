"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useActiveCommunity } from "@/features/communities/hooks/useActiveCommunity";

type Settings = {
  defaultCommunityId: string | null;
  emailNotifications: boolean;
  defaultCommunity?: {
    id: string;
    name: string;
  } | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const { userCommunities, setActiveCommunity } = useActiveCommunity();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/users/me/settings");
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/users/me/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess(true);

      if (updatedSettings.defaultCommunity) {
        setActiveCommunity(updatedSettings.defaultCommunity);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Configuración</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Comunidad por defecto</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Selecciona la comunidad que se mostrará automáticamente al iniciar sesión
          </p>

          <div className="space-y-2">
            <Label htmlFor="defaultCommunity">Comunidad</Label>
            <select
              id="defaultCommunity"
              value={settings?.defaultCommunityId || ""}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev!,
                  defaultCommunityId: e.target.value || null,
                }))
              }
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sin comunidad por defecto</option>
              {userCommunities.map((community) => (
                <option key={community.id} value={community.id}>
                  {community.name} - {community.city}, {community.country}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings?.emailNotifications ?? true}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev!,
                  emailNotifications: e.target.checked,
                }))
              }
              className="w-4 h-4"
            />
            <Label htmlFor="emailNotifications" className="cursor-pointer">
              Recibir notificaciones por correo electrónico
            </Label>
          </div>
        </Card>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">{error}</div>
        )}

        {success && (
          <div className="bg-success-light text-success p-3 rounded-md text-sm border border-success/20">
            Configuración guardada correctamente
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
