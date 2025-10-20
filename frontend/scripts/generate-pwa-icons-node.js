const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');
const PUBLIC_DIR = path.join(__dirname, '../public');
const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SHORTCUTS = [
  { name: 'marketplace', emoji: '🛒' },
  { name: 'events', emoji: '📅' },
  { name: 'chat', emoji: '💬' }
];

const COLORS = {
  primary: '#16a34a',
  secondary: '#15803d',
  white: '#ffffff'
};

const ensureDir = (dir) => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

const createGradient = (id, color1, color2) => `
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>`;

const createLeaf = (size, offsetX, offsetY) => {
  const w = size * 0.25;
  const h = size * 0.3;
  return `
  <g transform="translate(${offsetX}, ${offsetY})">
    <path d="M ${w} 0 Q ${w * 2} 0 ${w * 2} ${h} Q ${w * 2} ${h * 1.67} ${w} ${h * 2} Q 0 ${h * 1.67} 0 ${h} Q 0 0 ${w} 0 Z" 
          fill="${COLORS.white}" opacity="0.9"/>
    <path d="M ${w} ${h * 0.33} L ${w} ${h * 1.67}" 
          stroke="${COLORS.white}" stroke-width="${size * 0.02}" opacity="0.7"/>
  </g>`;
};

const createText = (size, text) => size >= 192 ? `
  <text x="50%" y="${size * 0.85}" font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" font-weight="bold" fill="${COLORS.white}" 
        text-anchor="middle" opacity="0.9">${text}</text>` : '';

const generateIcon = (size, maskable = false) => {
  const gradId = `grad${size}${maskable ? 'M' : ''}`;
  const shape = maskable 
    ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#${gradId})"/>`
    : `<rect width="${size}" height="${size}" fill="url(#${gradId})" rx="${size * 0.1}"/>`;
  
  const padding = maskable ? size * 0.1 : 0;
  const leafX = padding + size * 0.25;
  const leafY = padding + size * 0.2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${createGradient(gradId, COLORS.primary, COLORS.secondary)}
  ${shape}
  ${createLeaf(size * (maskable ? 0.8 : 1), leafX, leafY)}
  ${createText(size, 'ECOMAMA')}
</svg>`;
};

const generateShortcut = (size, emoji) => {
  const gradId = `gradShortcut${size}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${createGradient(gradId, COLORS.primary, COLORS.secondary)}
  <rect width="${size}" height="${size}" fill="url(#${gradId})" rx="${size * 0.1}"/>
  <text x="50%" y="60%" font-size="${size * 0.5}" text-anchor="middle" 
        dominant-baseline="middle">${emoji}</text>
</svg>`;
};

const updateManifest = (manifestPath) => {
  if (!fs.existsSync(manifestPath)) return;
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  manifest.icons = [
    ...ICON_SIZES.map(size => ({
      src: `/icons/icon-${size}x${size}.svg`,
      sizes: `${size}x${size}`,
      type: 'image/svg+xml',
      purpose: 'any'
    })),
    ...ICON_SIZES.map(size => ({
      src: `/icons/icon-${size}x${size}-maskable.svg`,
      sizes: `${size}x${size}`,
      type: 'image/svg+xml',
      purpose: 'maskable'
    }))
  ];

  if (manifest.shortcuts) {
    manifest.shortcuts = manifest.shortcuts.map(shortcut => ({
      ...shortcut,
      icons: [{
        src: `/icons/shortcut-${shortcut.name.toLowerCase()}.svg`,
        sizes: '96x96',
        type: 'image/svg+xml'
      }]
    }));
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
};

const main = () => {
  console.log('🎨 Generating PWA icons...\n');
  
  ensureDir(ICONS_DIR);

  ICON_SIZES.forEach(size => {
    fs.writeFileSync(
      path.join(ICONS_DIR, `icon-${size}x${size}.svg`),
      generateIcon(size),
      'utf8'
    );
    fs.writeFileSync(
      path.join(ICONS_DIR, `icon-${size}x${size}-maskable.svg`),
      generateIcon(size, true),
      'utf8'
    );
  });

  SHORTCUTS.forEach(({ name, emoji }) => {
    fs.writeFileSync(
      path.join(ICONS_DIR, `shortcut-${name}.svg`),
      generateShortcut(96, emoji),
      'utf8'
    );
  });

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'favicon.svg'),
    generateIcon(48),
    'utf8'
  );

  updateManifest(path.join(PUBLIC_DIR, 'manifest.json'));
  updateManifest(path.join(PUBLIC_DIR, 'manifest.es.json'));

  console.log(`✅ Generated ${ICON_SIZES.length * 2 + SHORTCUTS.length + 1} icons\n`);
};

main();
