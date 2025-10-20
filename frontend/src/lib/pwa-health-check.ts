/**
 * PWA Health Check Utility
 * Validates PWA configuration and functionality
 * 
 * @module pwa-health-check
 */

export interface PWAHealthStatus {
  isHealthy: boolean;
  checks: {
    serviceWorker: boolean;
    manifest: boolean;
    icons: boolean;
    offline: boolean;
    https: boolean;
  };
  warnings: string[];
  errors: string[];
}

/**
 * Perform comprehensive PWA health check
 * @returns Health status with detailed checks
 */
export async function checkPWAHealth(): Promise<PWAHealthStatus> {
  const checks = {
    serviceWorker: false,
    manifest: false,
    icons: false,
    offline: false,
    https: false,
  };
  
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check HTTPS (required for PWA)
  if (typeof window !== 'undefined') {
    checks.https = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!checks.https) {
      errors.push('PWA requires HTTPS or localhost');
    }
  }

  // Check Service Worker registration
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      checks.serviceWorker = !!registration;
      if (!registration) {
        errors.push('Service Worker not registered');
      }
    } catch (error) {
      errors.push(`Service Worker check failed: ${error}`);
    }
  } else {
    errors.push('Service Worker not supported in this browser');
  }

  // Check Manifest
  try {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      const manifestUrl = manifestLink.getAttribute('href');
      if (manifestUrl) {
        const response = await fetch(manifestUrl);
        if (response.ok) {
          const manifest = await response.json();
          checks.manifest = !!(manifest.name && manifest.icons && manifest.start_url);
          
          // Validate icons
          if (manifest.icons && Array.isArray(manifest.icons)) {
            checks.icons = manifest.icons.length > 0;
            
            // Check for required icon sizes
            const hasRequiredSizes = manifest.icons.some((icon: { sizes: string }) => 
              ['192x192', '512x512'].some(size => icon.sizes.includes(size))
            );
            
            if (!hasRequiredSizes) {
              warnings.push('Missing recommended icon sizes (192x192, 512x512)');
            }
          } else {
            warnings.push('Manifest does not contain icons');
          }
        } else {
          errors.push(`Manifest fetch failed: ${response.status}`);
        }
      }
    } else {
      errors.push('Manifest link not found in HTML');
    }
  } catch (error) {
    errors.push(`Manifest check failed: ${error}`);
  }

  // Check offline page
  try {
    const response = await fetch('/offline', { method: 'HEAD' });
    checks.offline = response.ok;
    if (!response.ok) {
      warnings.push('Offline fallback page not accessible');
    }
  } catch (error) {
    warnings.push('Offline page check failed');
  }

  const isHealthy = checks.serviceWorker && checks.manifest && checks.https && errors.length === 0;

  return {
    isHealthy,
    checks,
    warnings,
    errors,
  };
}

/**
 * Log PWA health status to console
 */
export async function logPWAHealth(): Promise<void> {
  const health = await checkPWAHealth();
  
  console.group('🔍 PWA Health Check');
  console.log('Status:', health.isHealthy ? '✅ Healthy' : '❌ Issues Detected');
  console.log('Checks:', health.checks);
  
  if (health.warnings.length > 0) {
    console.warn('⚠️ Warnings:', health.warnings);
  }
  
  if (health.errors.length > 0) {
    console.error('❌ Errors:', health.errors);
  }
  
  console.groupEnd();
}

/**
 * Get PWA installation readiness score (0-100)
 */
export function getPWAReadinessScore(health: PWAHealthStatus): number {
  const weights = {
    serviceWorker: 30,
    manifest: 25,
    icons: 15,
    offline: 15,
    https: 15,
  };
  
  let score = 0;
  for (const [check, passed] of Object.entries(health.checks)) {
    if (passed) {
      score += weights[check as keyof typeof weights] || 0;
    }
  }
  
  // Deduct points for errors
  score -= health.errors.length * 5;
  
  return Math.max(0, Math.min(100, score));
}
