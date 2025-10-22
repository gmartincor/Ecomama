import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

interface ToastNotificationOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToastNotifications() {
  const { toast } = useToast();
  const t = useTranslations('notifications');

  const showSuccess = (message: string, options?: ToastNotificationOptions) => {
    toast({
      title: options?.title || t('success'),
      description: message,
      variant: 'default',
      ...options,
    });
  };

  const showError = (message: string, options?: ToastNotificationOptions) => {
    toast({
      title: options?.title || t('error'),
      description: message,
      variant: 'destructive',
      ...options,
    });
  };

  const showInfo = (message: string, options?: ToastNotificationOptions) => {
    toast({
      title: options?.title || t('info'),
      description: message,
      variant: 'default',
      ...options,
    });
  };

  const showWarning = (message: string, options?: ToastNotificationOptions) => {
    toast({
      title: options?.title || t('warning'),
      description: message,
      variant: 'default',
      ...options,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
