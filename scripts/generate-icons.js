import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const svgPath = path.resolve('public/icons/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.resolve('public/icons');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  for (const size of sizes) {
    const dest = path.join(outDir, `icon-${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(dest);
    console.log(`Generated: ${dest}`);
  }

  // Also create maskable icon with safe zone padding
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#047857'
    })
    .png()
    .toFile(path.join(outDir, 'icon-maskable-512.png'));
  console.log('Generated maskable icon');

  // Also create apple-touch-icon.png in public
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));

  // Also copy 192 as favicon or 32x32
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.resolve('public/favicon.ico'));

  console.log('All icons generated successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
