#!/usr/bin/env node

/**
 * PWA Validation Script
 * Validates PWA configuration and reports issues
 * 
 * Usage: node scripts/validate-pwa.js
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'public/sw.js',
  'public/browserconfig.xml',
  'src/lib/pwa-config.ts',
  'src/lib/pwa-manifest.ts',
  'src/lib/workbox.config.ts',
  'src/components/PWAProvider.tsx',
  'src/app/offline/page.tsx',
];

const REQUIRED_ICONS = [
  'public/icons/icon-192x192.svg',
  'public/icons/icon-512x512.svg',
  'public/icons/icon-192x192-maskable.svg',
  'public/icons/icon-512x512-maskable.svg',
];

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_WS_URL',
];

function checkFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

function validatePWA() {
  console.log('🔍 Validating PWA Configuration...\n');
  
  let hasErrors = false;
  let hasWarnings = false;

  // Check required files
  console.log('📁 Checking required files...');
  for (const file of REQUIRED_FILES) {
    const exists = checkFile(file);
    if (exists) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      hasErrors = true;
    }
  }

  // Check icons
  console.log('\n🎨 Checking PWA icons...');
  for (const icon of REQUIRED_ICONS) {
    const exists = checkFile(icon);
    if (exists) {
      console.log(`  ✅ ${icon}`);
    } else {
      console.log(`  ⚠️  ${icon} - MISSING (recommended)`);
      hasWarnings = true;
    }
  }

  // Check package.json for PWA dependencies
  console.log('\n📦 Checking dependencies...');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = [
      '@ducanh2912/next-pwa',
      'workbox-window',
    ];

    for (const dep of requiredDeps) {
      if (deps[dep]) {
        console.log(`  ✅ ${dep} (${deps[dep]})`);
      } else {
        console.log(`  ❌ ${dep} - NOT INSTALLED`);
        hasErrors = true;
      }
    }
  }

  // Check next.config.js
  console.log('\n⚙️  Checking Next.js configuration...');
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    const checks = [
      { pattern: /withPWA/i, name: 'PWA plugin configured' },
      { pattern: /workboxOptions/i, name: 'Workbox options configured' },
      { pattern: /register:\s*true/i, name: 'SW registration enabled' },
    ];

    for (const check of checks) {
      if (check.pattern.test(nextConfig)) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.log(`  ⚠️  ${check.name} - NOT FOUND`);
        hasWarnings = true;
      }
    }
  } else {
    console.log('  ❌ next.config.js - NOT FOUND');
    hasErrors = true;
  }

  // Environment variables check
  console.log('\n🌍 Environment variables (check manually):');
  for (const envVar of REQUIRED_ENV_VARS) {
    console.log(`  ℹ️  ${envVar} - Check .env file`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ PWA Validation FAILED - Fix errors above');
    process.exit(1);
  } else if (hasWarnings) {
    console.log('⚠️  PWA Validation PASSED with warnings');
    console.log('   Consider addressing warnings for best experience');
    process.exit(0);
  } else {
    console.log('✅ PWA Validation PASSED - All checks successful!');
    process.exit(0);
  }
}

// Run validation
validatePWA();
