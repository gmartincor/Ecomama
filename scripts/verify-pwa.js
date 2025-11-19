#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const PRODUCTION_URL = process.env.VERCEL_URL || 'ecomama-mvp-guillermos-projects-1bb50025.vercel.app';
const isDev = process.argv.includes('--dev');
const baseUrl = isDev ? 'http://localhost:3000' : `https://${PRODUCTION_URL}`;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
};

const requiredIcons = [
  { size: '72x72', file: 'icon-72x72.png' },
  { size: '96x96', file: 'icon-96x96.png' },
  { size: '128x128', file: 'icon-128x128.png' },
  { size: '144x144', file: 'icon-144x144.png' },
  { size: '152x152', file: 'icon-152x152.png' },
  { size: '180x180', file: 'icon-180x180.png', critical: true },
  { size: '192x192', file: 'icon-192x192.png', critical: true, maskable: true },
  { size: '384x384', file: 'icon-384x384.png', maskable: true },
  { size: '512x512', file: 'icon-512x512.png', critical: true, maskable: true },
];

async function checkLocalIcons() {
  log.header('Verificando Iconos Locales');
  
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  let passed = true;

  for (const icon of requiredIcons) {
    const iconPath = path.join(iconsDir, icon.file);
    const exists = fs.existsSync(iconPath);
    
    if (exists) {
      const stats = fs.statSync(iconPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      log.success(`${icon.size} - ${sizeKB}KB${icon.critical ? ' (crítico)' : ''}`);
    } else {
      log.error(`${icon.size} - No encontrado${icon.critical ? ' (CRÍTICO)' : ''}`);
      passed = false;
    }
  }

  return passed;
}

async function checkManifest() {
  log.header('Verificando Manifest.json');
  
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  
  let passed = true;

  if (manifest.name) {
    log.success(`Name: ${manifest.name}`);
  } else {
    log.error('Name no definido');
    passed = false;
  }

  if (manifest.short_name) {
    log.success(`Short name: ${manifest.short_name}`);
  } else {
    log.warning('Short name no definido (recomendado)');
  }

  if (manifest.start_url) {
    log.success(`Start URL: ${manifest.start_url}`);
  } else {
    log.error('Start URL no definido');
    passed = false;
  }

  if (manifest.display) {
    log.success(`Display mode: ${manifest.display}`);
  } else {
    log.error('Display mode no definido');
    passed = false;
  }

  const iconCount = manifest.icons?.length || 0;
  if (iconCount >= 8) {
    log.success(`Icons: ${iconCount} definidos`);
  } else {
    log.warning(`Icons: solo ${iconCount} definidos (recomendado: 8+)`);
  }

  const maskableIcons = manifest.icons?.filter(icon => 
    icon.purpose?.includes('maskable')
  ).length || 0;

  if (maskableIcons >= 3) {
    log.success(`Maskable icons: ${maskableIcons}`);
  } else {
    log.warning(`Maskable icons: ${maskableIcons} (recomendado: 3+)`);
  }

  return passed;
}

async function checkServiceWorker() {
  log.header('Verificando Service Worker');
  
  const swPath = path.join(__dirname, '..', 'public', 'sw.js');
  const swContent = fs.readFileSync(swPath, 'utf-8');
  
  let passed = true;

  if (swContent.includes('CACHE_VERSION')) {
    const match = swContent.match(/CACHE_VERSION = '(.+?)'/);
    log.success(`Cache version: ${match ? match[1] : 'detectada'}`);
  } else {
    log.error('Cache version no encontrada');
    passed = false;
  }

  if (swContent.includes('install')) {
    log.success('Install event handler presente');
  } else {
    log.error('Install event handler no encontrado');
    passed = false;
  }

  if (swContent.includes('activate')) {
    log.success('Activate event handler presente');
  } else {
    log.error('Activate event handler no encontrado');
    passed = false;
  }

  if (swContent.includes('fetch')) {
    log.success('Fetch event handler presente');
  } else {
    log.error('Fetch event handler no encontrado');
    passed = false;
  }

  return passed;
}

async function main() {
  console.log('\n🌱 Ecomama PWA Verification Script\n');
  
  const results = {
    icons: await checkLocalIcons(),
    manifest: await checkManifest(),
    sw: await checkServiceWorker(),
  };

  log.header('Resumen');
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    log.success('Todas las verificaciones pasaron correctamente');
    console.log('\n✨ La PWA está lista para deployment\n');
    process.exit(0);
  } else {
    log.error('Algunas verificaciones fallaron');
    console.log('\n❌ Corrige los errores antes de hacer deployment\n');
    process.exit(1);
  }
}

main().catch(error => {
  log.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});
