const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const EMOJI = '🌱';
const BG_COLOR = '#ffffff';
const EMOJI_COLOR = '#4a9d5f';

const iconDir = path.join(__dirname, '..', 'public', 'icons');
const appDir = path.join(__dirname, '..', 'app');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG_COLOR}"/>
  <text x="50%" y="50%" font-size="${size * 0.7}" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif">${EMOJI}</text>
</svg>`;
}

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, size, size);
  
  const fontSize = Math.floor(size * 0.65);
  const textY = size * 0.58;
  
  ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = EMOJI_COLOR;
  
  const measures = ctx.measureText(EMOJI);
  const emojiWidth = measures.width;
  
  if (emojiWidth === 0) {
    ctx.fillStyle = EMOJI_COLOR;
    const leafSize = size * 0.4;
    const centerX = size / 2;
    const centerY = size / 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - leafSize);
    ctx.quadraticCurveTo(centerX + leafSize * 0.8, centerY - leafSize * 0.5, centerX + leafSize * 0.6, centerY);
    ctx.quadraticCurveTo(centerX + leafSize * 0.3, centerY + leafSize * 0.3, centerX, centerY + leafSize);
    ctx.quadraticCurveTo(centerX - leafSize * 0.3, centerY + leafSize * 0.3, centerX - leafSize * 0.6, centerY);
    ctx.quadraticCurveTo(centerX - leafSize * 0.8, centerY - leafSize * 0.5, centerX, centerY - leafSize);
    ctx.fill();
    
    ctx.strokeStyle = EMOJI_COLOR;
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - leafSize * 0.2, centerY - leafSize * 0.3);
    ctx.stroke();
  } else {
    ctx.fillText(EMOJI, size / 2, textY);
  }
  
  return canvas.toBuffer('image/png');
}

async function generateAllIcons() {
  const pwaIconSizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
  
  console.log('Generating PWA icons...');
  for (const size of pwaIconSizes) {
    const buffer = generateIcon(size);
    fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.png`), buffer);
    console.log(`✓ icon-${size}x${size}.png`);
  }
  
  console.log('Generating favicon...');
  const faviconBuffer = generateIcon(32);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), faviconBuffer);
  console.log('✓ favicon.ico');
  
  console.log('Generating SVG icon...');
  const svgIcon = createSVGIcon(512);
  fs.writeFileSync(path.join(iconDir, 'icon.svg'), svgIcon);
  console.log('✓ icon.svg');
  
  console.log('\n✅ All icons generated successfully!');
}

generateAllIcons().catch(console.error);
