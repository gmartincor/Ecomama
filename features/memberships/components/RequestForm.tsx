"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

type RequestFormProps = {
  communityId: string;
  communityName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const RequestForm = ({
  communityId,
  communityName,
  onSuccess,
  onCancel,
}: RequestFormProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/communities/${communityId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit request");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Solicitar membresía en {communityName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje para el administrador</Label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explica por qué quieres unirte a esta comunidad..."
            className="w-full min-h-32 px-3 py-2 border rounded-md"
            required
            minLength={10}
            maxLength={500}
          />
          <p className="text-xs text-gray-500">{message.length}/500 caracteres</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || message.length < 10}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
