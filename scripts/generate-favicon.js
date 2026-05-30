const sharp = require('sharp');
const fs = require('fs');

// Simple favicon: dark square with "EMT" text (matching the OG design)
const svgFavicon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0F172A" rx="96"/>
  <text x="256" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="200" font-weight="700" fill="#FFFFFF">EMT</text>
</svg>
`;

async function generateFavicons() {
  const buffer = Buffer.from(svgFavicon);

  // Generate multiple sizes
  await sharp(buffer).resize(32, 32).toFile('public/favicon-32x32.png');
  await sharp(buffer).resize(16, 16).toFile('public/favicon-16x16.png');
  await sharp(buffer).resize(180, 180).toFile('public/apple-touch-icon.png');
  await sharp(buffer).resize(192, 192).toFile('public/android-chrome-192x192.png');
  await sharp(buffer).resize(512, 512).toFile('public/android-chrome-512x512.png');

  // Generate ICO (just use 32x32 PNG, browsers handle it)
  await sharp(buffer).resize(32, 32).toFile('public/favicon.ico');

  console.log('✓ Generated all favicon sizes');
}

generateFavicons().catch(console.error);
