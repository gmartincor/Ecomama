/**
 * PWA Configuration Constants
 * Centralized configuration for PWA features
 * 
 * @module pwa-config
 */

export const PWA_CONFIG = {
  /**
   * App identification
   */
  APP_NAME: 'Ecomama',
  APP_SHORT_NAME: 'Ecomama',
  APP_DESCRIPTION: 'A multi-user platform connecting farmers and consumers for the direct purchase of organic products. More than a marketplace, a cultural movement.',
  
  /**
   * Theme and branding
   */
  THEME_COLOR: '#16a34a',
  BACKGROUND_COLOR: '#ffffff',
  
  /**
   * Display modes
   */
  DISPLAY_MODE: 'standalone' as const,
  ORIENTATION: 'portrait-primary' as const,
  
  /**
   * Engagement thresholds for install prompt
   */
  ENGAGEMENT: {
    DELAY_MS: 30000,           // 30 seconds
    MIN_INTERACTIONS: 2,        // Minimum user interactions
    DISMISS_PERIOD_DAYS: 30,   // Days before showing again after dismiss
  },
  
  /**
   * Update notification settings
   */
  UPDATE: {
    CHECK_INTERVAL_MS: 60000,  // Check for updates every minute
    AUTO_UPDATE_DELAY_MS: 5000, // Auto-update after 5 seconds
  },
  
  /**
   * Offline settings
   */
  OFFLINE: {
    NOTIFICATION_TIMEOUT_MS: 3000, // Hide "back online" after 3 seconds
  },
  
  /**
   * Feature flags
   */
  FEATURES: {
    INSTALL_PROMPT: true,
    UPDATE_NOTIFICATION: true,
    OFFLINE_INDICATOR: true,
    PUSH_NOTIFICATIONS: false,  // Not yet implemented
    BACKGROUND_SYNC: false,     // Not yet implemented
  },
} as const;

export type PWAConfig = typeof PWA_CONFIG;
