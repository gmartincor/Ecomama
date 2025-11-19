export interface PWAValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: Record<string, unknown>;
}

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

interface Manifest {
  name?: string;
  short_name?: string;
  start_url?: string;
  display?: string;
  icons?: ManifestIcon[];
}

interface BrowserInfo {
  isChrome: boolean;
  isEdge: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isMobile: boolean;
}

export const validatePWA = async (): Promise<PWAValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: Record<string, unknown> = {};

  if (typeof window === 'undefined') {
    return { isValid: false, errors: ['Not in browser context'], warnings, info };
  }

  info.isSecureContext = window.isSecureContext;
  if (!window.isSecureContext) {
    errors.push('Not a secure context (HTTPS required)');
  }

  info.hasServiceWorker = 'serviceWorker' in navigator;
  if (!('serviceWorker' in navigator)) {
    errors.push('Service Worker not supported');
  }

  try {
    const manifestResponse = await fetch('/manifest.json');
    const manifest: Manifest = await manifestResponse.json();
    
    info.manifestName = manifest.name;
    info.manifestShortName = manifest.short_name;
    info.manifestStartUrl = manifest.start_url;
    info.manifestDisplay = manifest.display;
    info.manifestIcons = manifest.icons?.length || 0;

    if (!manifest.name) errors.push('Manifest missing name');
    if (!manifest.short_name) warnings.push('Manifest missing short_name');
    if (!manifest.start_url) errors.push('Manifest missing start_url');
    if (!manifest.display) warnings.push('Manifest missing display mode');
    
    const has192Icon = manifest.icons?.some((icon) => 
      icon.sizes === '192x192' && icon.type === 'image/png'
    );
    const has512Icon = manifest.icons?.some((icon) => 
      icon.sizes === '512x512' && icon.type === 'image/png'
    );
    
    if (!has192Icon) errors.push('Missing 192x192 icon');
    if (!has512Icon) errors.push('Missing 512x512 icon');

    const hasMaskable = manifest.icons?.some((icon) => 
      icon.purpose?.includes('maskable')
    );
    if (!hasMaskable) warnings.push('No maskable icons found');

  } catch {
    errors.push('Failed to load manifest.json');
  }

  info.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  info.userAgent = navigator.userAgent;
  
  const ua = navigator.userAgent.toLowerCase();
  const browserInfo: BrowserInfo = {
    isChrome: /chrome/.test(ua) && !/edg/.test(ua),
    isEdge: /edg/.test(ua),
    isSafari: /safari/.test(ua) && !/chrome/.test(ua),
    isFirefox: /firefox/.test(ua),
    isMobile: /mobile|android|iphone|ipad|ipod/.test(ua),
  };
  info.browser = browserInfo;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    info.serviceWorkerRegistered = !!registration;
    info.serviceWorkerActive = !!registration?.active;
    info.serviceWorkerScope = registration?.scope;
  } catch {
    warnings.push('Could not check Service Worker registration');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info,
  };
};
