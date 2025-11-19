'use client';

import { Button } from '@/components/ui/Button';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallPWAButton = () => {
  const { canInstall, isStandalone, promptInstall, isSecureContext, isSupportedBrowser } = useInstallPrompt();

  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    await promptInstall();
  };

  const showButton = isSecureContext && isSupportedBrowser;

  if (!showButton) {
    return null;
  }

  return (
    <Button
      variant={canInstall ? 'accent' : 'ghost'}
      size="sm"
      onClick={handleInstall}
      className="gap-2"
      disabled={!canInstall}
    >
      <span className="text-lg">📱</span>
      <span className="hidden sm:inline">Instalar App</span>
      <span className="sm:hidden">App</span>
    </Button>
  );
};
