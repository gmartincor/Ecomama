import { useState } from "react";
import { signOut } from "next-auth/react";

const LOGIN_ROUTE = "/login";

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);

    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      await signOut({ 
        redirect: true,
        callbackUrl: LOGIN_ROUTE
      });
    } catch (error) {
      console.error('[LOGOUT] Error:', error);
      setIsLoggingOut(false);
      window.location.href = LOGIN_ROUTE;
    }
  };

  return { handleLogout, isLoggingOut };
}
