"use client";

import { useState } from "react";

type UseEventRegistrationResult = {
  isRegistering: boolean;
  register: (eventId: string) => Promise<void>;
  cancel: (eventId: string) => Promise<void>;
};

export const useEventRegistration = (
  onSuccess?: () => void
): UseEventRegistrationResult => {
  const [isRegistering, setIsRegistering] = useState(false);

  const register = async (eventId: string) => {
    setIsRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrarse en el evento");
      }

      onSuccess?.();
    } finally {
      setIsRegistering(false);
    }
  };

  const cancel = async (eventId: string) => {
    setIsRegistering(true);
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cancelar inscripción");
      }

      onSuccess?.();
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    isRegistering,
    register,
    cancel,
  };
};
