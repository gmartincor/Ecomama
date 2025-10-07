const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    ctx.font = `${size * 0.55}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌱', size / 2, size / 2);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(iconDir, `icon-${size}x${size}.png`), buffer);
    console.log(`Generated icon-${size}x${size}.png`);
  }
  
  const canvas192 = createCanvas(192, 192);
  const ctx192 = canvas192.getContext('2d');
  ctx192.fillStyle = 'white';
  ctx192.fillRect(0, 0, 192, 192);
  ctx192.font = '106px Arial';
  ctx192.textAlign = 'center';
  ctx192.textBaseline = 'middle';
  ctx192.fillText('🌱', 96, 96);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon-192.png'), canvas192.toBuffer('image/png'));
  console.log('Generated icon-192.png');
  
  const canvas512 = createCanvas(512, 512);
  const ctx512 = canvas512.getContext('2d');
  ctx512.fillStyle = 'white';
  ctx512.fillRect(0, 0, 512, 512);
  ctx512.font = '282px Arial';
  ctx512.textAlign = 'center';
  ctx512.textBaseline = 'middle';
  ctx512.fillText('🌱', 256, 256);
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'icon-512.png'), canvas512.toBuffer('image/png'));
  console.log('Generated icon-512.png');
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
