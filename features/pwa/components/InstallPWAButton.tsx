'use client';

import { Button } from '@/components/ui/Button';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export const InstallPWAButton = () => {
  const { canInstall, isStandalone, promptInstall } = useInstallPrompt();

  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    if (!canInstall) {
      return;
    }

    await promptInstall();
  };

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
